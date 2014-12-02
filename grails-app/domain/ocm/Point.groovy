package ocm

import grails.rest.*

/**
 * A point geometry.
 *
 * Also doubles as a point within a complex geometry.
 */
@Resource(uri='/point', formats=['json'])
class Point extends Geometry {
  float longitude
  float latitude
  float altitude
  // The parent property is set when point is part of a complex geometry.
  // Otherwise it is null.
  Geometry parent
  // Using 'ord' here because order is a reserved word in most databases and
  // the ORM is not smart enough to handle this.
  int ord

  static constraints = {
    longitude min: -180.0F, max: 180.0F
    latitude min: -90.0F, max: 90.0F
    altitude min: 0.0F
    parent nullable: true
  }

  static mapping = {
    longitude defaultValue: 0.0F
    latitude defaultValue: 0.0F
    altitude defaultValue: 0.0F
    ord defaultValue: 0
    sort 'ord'
  }
}
