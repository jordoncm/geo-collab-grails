package ocm

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin}
 * for usage instructions.
 */
@TestFor(Line)
@Mock([Line, Point])
class LineSpec extends Specification {
  def setup() {
  }

  def cleanup() {
  }

  void 'Ensure cascade of deletion.'() {
    when:
      def line = new Line(points: [new Point(longitude: 0.0, latitude: 0.0)])
      line.save()
      def pointId = line.points[0].id
      line.delete()
    then:
      Point.get(pointId) == null
  }
}
