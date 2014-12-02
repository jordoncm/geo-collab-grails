package ocm

import java.util.UUID
import grails.rest.*

/**
 * A shared map.
 */
@Resource(uri='/map', formats=['json'])
class Map {
  // Using UUID's instead of autoincrementing numbers to allow for database
  // merges.
  String id = UUID.randomUUID().toString()
  String name
  String description

  static hasMany = [features: Geometry]

  static mapping = {
    id generator: 'assigned'
    name defaultValue: ''
    description defaultValue: ''
    // Make sure child objects don not lazy load in order for JSON controllers
    // to not be missing fields in result sets.
    features lazy: false, cascade: 'all-delete-orphan'
  }
}
