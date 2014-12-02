package ocm

import grails.rest.*

/**
 *
 */
@Resource(uri='/rectangle', formats=['json'])
class Rectangle extends Geometry {
  static hasMany = [points: Point]

  static mapping = {
    points cascade: 'all-delete-orphan'
  }
}
