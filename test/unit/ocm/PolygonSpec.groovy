package ocm

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin}
 * for usage instructions.
 */
@TestFor(Polygon)
@Mock([Polygon, Point])
class PolygonSpec extends Specification {
  def setup() {
  }

  def cleanup() {
  }

  void 'Ensure cascade of deletion.'() {
    when:
      def polygon = new Polygon(points: [
        new Point(longitude: 0.0, latitude: 0.0)
      ])
      polygon.save()
      def pointId = polygon.points[0].id
      polygon.delete()
    then:
      Polygon.get(pointId) == null
  }
}
