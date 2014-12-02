package ocm

import java.util.UUID
import grails.rest.*

/**
 * A shared map.
 */
@Resource(uri='/map', formats=['json'])
class Map {
  String id = UUID.randomUUID().toString()
  String name
  String description

  static hasMany = [features: Geometry]

  static mapping = {
    id generator: 'assigned'
    name defaultValue: ''
    description defaultValue: ''
    features lazy: false, cascade: 'all-delete-orphan'
  }
}
