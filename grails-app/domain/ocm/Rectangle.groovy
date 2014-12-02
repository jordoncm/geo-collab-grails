package ocm

import grails.rest.*

/**
 * A rectangle geometry.
 */
@Resource(uri='/rectangle', formats=['json'])
class Rectangle extends Polygon {
}
