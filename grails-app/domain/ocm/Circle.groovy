package ocm

import grails.rest.*

/**
 * A circle geomtery.
 */
@Resource(uri='/circle', formats=['json'])
class Circle extends Geometry {
  float longitude
  float latitude
  float radius

  static constraints = {
    longitude min: -180.0F, max: 180.0F
    latitude min: -90.0F, max: 90.0F
    radius min: 0.0F
  }

  static mapping = {
    longitude defaultValue: 0.0F
    latitude defaultValue: 0.0F
    radius defaultValue: 0.0F
  }
}
