package ocm

import grails.rest.*

/**
 * A rectangle geometry.
 */
@Resource(uri='/rectangle', formats=['json'])
class Rectangle extends Geometry {
  static hasMany = [points: Point]

  static mapping = {
    points cascade: 'all-delete-orphan'
  }
}
