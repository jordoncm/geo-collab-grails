package ocm

import java.util.UUID

class Geometry {
  String id = UUID.randomUUID().toString()
  Map map

  static constraints = {
    map nullable: true
  }

  static mapping = {
    id generator: 'assigned'
    map defaultValue: null
    tablePerHierarchy true
  }
}
