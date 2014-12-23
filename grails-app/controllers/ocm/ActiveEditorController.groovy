package ocm

import java.util.UUID

import grails.transaction.Transactional
import groovy.json.JsonSlurper
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo

class ActiveEditorController {
  def sessionFactory

  def index() {}

  @MessageMapping('/register')
  @SendTo('/topics/register-ack')
  @Transactional
  protected register(String mapId) {
    def editor = new ActiveEditor(mapId: mapId)
    editor.save()

    return [
      'id': editor.id,
      'map': mapId,
      'editors': ActiveEditor.countByMapId(mapId)
    ]
  }

  @MessageMapping('/heartbeat')
  @SendTo('/topics/heartbeat-ack')
  @Transactional
  protected heartbeat(String text) {
    // Jackson can't parse JSON objects into POGO's, in order to send complex
    // objects from the client we are expecting strings and parsing it out
    // manually.
    def slurper = new JsonSlurper()
    def message = slurper.parseText(text)

    def editor = ActiveEditor.get(message.id)
    if(editor) {
      editor.lastCheckIn = System.currentTimeMillis()
      editor.save()
    }

    def editors = ActiveEditor.findAll {
      lastCheckIn < System.currentTimeMillis() - 2000
      mapId == message.mapId
    }

    if(editors.size()) {
      editors.each { i ->
        i.delete()
      }
      // Clearing the query cache so the editor count updates quickly.
      try {
        sessionFactory.cache.evictEntityRegion(ActiveEditor)
      } catch(e) {
        // Testing environment will not have a sessionFactory.
        log.warn e
      }
    }

    return [
      'id': message.id,
      'map': message.mapId,
      'editors': ActiveEditor.countByMapId(message.mapId)
    ]
  }
}
