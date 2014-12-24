package ocm

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.domain.DomainClassUnitTestMixin}
 * for usage instructions.
 */
@TestFor(Circle)
class CircleSpec extends Specification {
  def setup() {
  }

  def cleanup() {
  }

  void 'Ensure negative radius is invalid.'() {
    when:
      def model = new Circle()
      model.radius = -1.01
      model.validate()
    then:
      model.hasErrors() == true
  }

  void 'Ensure high out of range longitude is invalid.'() {
    when:
      def model = new Circle()
      model.longitude = 181
      model.validate()
    then:
      model.hasErrors() == true
  }

  void 'Ensure low out of range longitude is invalid.'() {
    when:
      def model = new Circle()
      model.longitude = -181
      model.validate()
    then:
      model.hasErrors() == true
  }

  void 'Ensure high out of range latitude is invalid.'() {
    when:
      def model = new Circle()
      model.latitude = 91
      model.validate()
    then:
      model.hasErrors() == true
  }

  void 'Ensure low out of range latitude is invalid.'() {
    when:
      def model = new Circle()
      model.latitude = -91
      model.validate()
    then:
      model.hasErrors() == true
  }
}
