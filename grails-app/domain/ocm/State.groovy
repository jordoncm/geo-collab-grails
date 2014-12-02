package ocm

import grails.rest.*

/**
 * A state model of the map to allow creation of sharable links.
 */
@Resource(uri='/state', formats=['json'])
class State {
  View view

  static constraints = {
  }
}
