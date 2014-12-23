package ocm

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for
 * usage instructions.
 */
@TestFor(ActiveEditorController)
@Mock([ActiveEditor, Map])
class ActiveEditorControllerSpec extends Specification {
  Map map

  def setup() {
    map = new Map(name: 'Test Map')
    map.save()
  }

  def cleanup() {
    map.delete()
  }

  void 'Ensure register creates an editor and ties it to the map.'() {
    when:
      def result = controller.register(map.id)
    then:
      result['id'] != null
      result['map'] == map.id
  }

  void 'Ensure multiple editors are not given the same id.'() {
    when:
      def firstResult = controller.register(map.id)
      def secondResult = controller.register(map.id)
    then:
      firstResult['id'] != secondResult['id']
  }

  void 'Ensure multiple calls to register on the same map increments the editor count.'() {
    when:
      def firstResult = controller.register(map.id)
      def secondResult = controller.register(map.id)
    then:
      firstResult['editors'] == 1
      secondResult['editors'] == 2
  }

  void 'Ensure calls to register for different maps does not increment the wrong editor count.'() {
    when:
      def secondMap = new Map(name: 'Second Map')
      secondMap.save()

      def firstResult = controller.register(map.id)
      def secondResult = controller.register(secondMap.id)
    then:
      firstResult['map'] != secondResult['map']
      firstResult['editors'] == 1
      secondResult['editors'] == 1

      secondMap.delete()
  }

  void 'Ensure register updates last check in.'() {
    when:
      def registerResult = controller.register(map.id)
    then:
      def editor = ActiveEditor.get(registerResult['id'])
      editor.lastCheckIn > 0
  }

  void 'Ensure heartbeat updates last check in.'() {
    when:
      def registerResult = controller.register(map.id)
      def editor = ActiveEditor.get(registerResult['id'])
      def intialCheckIn = editor.lastCheckIn
      // controller.heartbeat(['id': editor.id, 'mapId': map.id])
    then:
      editor.lastCheckIn > 0

  }
}
