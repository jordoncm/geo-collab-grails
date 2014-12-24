package ocm

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin}
 * for usage instructions.
 */
@TestFor(Point)
class PointSpec extends Specification {
  def setup() {
  }

  def cleanup() {
  }

  void 'Ensure negative altitude is invalid.'() {
    when:
      def model = new Point()
      model.altitude = -1.01
      model.validate()
    then:
      model.hasErrors() == true
  }

  void 'Ensure high out of range longitude is invalid.'() {
    when:
      def model = new Point()
      model.longitude = 181
      model.validate()
    then:
      model.hasErrors() == true
  }

  void 'Ensure low out of range longitude is invalid.'() {
    when:
      def model = new Point()
      model.longitude = -181
      model.validate()
    then:
      model.hasErrors() == true
  }

  void 'Ensure high out of range latitude is invalid.'() {
    when:
      def model = new Point()
      model.latitude = 91
      model.validate()
    then:
      model.hasErrors() == true
  }

  void 'Ensure low out of range latitude is invalid.'() {
    when:
      def model = new Point()
      model.latitude = -91
      model.validate()
    then:
      model.hasErrors() == true
  }
}
