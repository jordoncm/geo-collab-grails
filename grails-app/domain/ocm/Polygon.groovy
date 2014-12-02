package ocm

import grails.rest.*

/**
 * A polygon geometry.
 */
@Resource(uri='/polygon', formats=['json'])
class Polygon extends Line {
}
