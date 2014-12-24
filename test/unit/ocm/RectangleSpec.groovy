package ocm

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin}
 * for usage instructions.
 */
@TestFor(Rectangle)
@Mock([Rectangle, Point])
class RectangleSpec extends Specification {
  def setup() {
  }

  def cleanup() {
  }

  void 'Ensure cascade of deletion.'() {
    when:
      def rectangle = new Rectangle(points: [
        new Point(longitude: 0.0, latitude: 0.0),
        new Point(longitude: 1.0, latitude: 1.0)
      ])
      rectangle.save()
      def pointId = rectangle.points[0].id
      rectangle.delete()
    then:
      Rectangle.get(pointId) == null
  }
}
