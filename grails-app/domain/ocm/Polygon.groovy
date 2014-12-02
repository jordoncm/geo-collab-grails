package ocm

import grails.rest.*

/**
 *
 */
@Resource(uri='/polygon', formats=['json'])
class Polygon extends Geometry {
  static hasMany = [points: Point]

  static mapping = {
    points cascade: 'all-delete-orphan'
  }
}
