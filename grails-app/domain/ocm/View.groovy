package ocm

import grails.rest.*

/**
 * A snapshot of a map view including longitude, latitdue and zoom level.
 */
@Resource(uri='/view', formats=['json'])
class View {
  float longitude
  float latitude
  int zoom

  static constraints = {
    longitude min: -180.0F, max: 180.0F
    latitude min: -90.0F, max: 90.0F
    zoom min: 0, max: 28
  }

  static mapping = {
    longitude defaultValue: 0.0F
    latitude defaultValue: 0.0F
    zoom defaultValue: 8
  }
}
