package ocm

import java.util.UUID

/**
 * Base class for geometry types.
 *
 * DO NOT INVOKE DIRECTLY.
 */
class Geometry {
  // Using UUID's instead of autoincrementing numbers to allow for database
  // merges.
  String id = UUID.randomUUID().toString()
  Map map

  static constraints = {
    map nullable: true
  }

  static mapping = {
    id generator: 'assigned'
    map defaultValue: null
    // All geometries regardless of type should be kept in a single table.
    tablePerHierarchy true
  }
}
