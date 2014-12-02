package ocm

import grails.rest.*

/**
 *
 */
@Resource(uri='/line', formats=['json'])
class Line extends Geometry {
  static hasMany = [points: Point]

  static mapping = {
    points cascade: 'all-delete-orphan'
  }
}
