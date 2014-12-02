//= require ocm/models.js
//= require ocm/views.js

var ocm = ocm || {};


/**
 * The URL base for the REST interface.
 *
 * @const {string}
 */
ocm.URL_BASE = '/ocm/';


/**
 * The URLs for the application.
 *
 * @enum {string}
 */
ocm.Urls = {};


/**
 * Publish/subscribe topics for the application.
 *
 * @enum {number}
 */
ocm.Topics = {
  MAP_CHANGED: 0
};


/**
 * Convert a list of features into a geometry collection.
 *
 * @param {Array.<Object.<string, *>>}
 * @return {ocm.models.GeometryCollection}
 */
ocm.featureArrayToGeometryCollection = function(features) {
  var buildPointCollection = function(collection, points) {
    _.each(points, function(point) {
      collection.add(new ocm.models.Point({
        id: point.id,
        longitude: point.longitude,
        latitude: point.latitude,
        altitude: point.altitude,
        ord: point.ord
      }));
    });
  };

  var geometryCollection = new ocm.models.GeometryCollection();
  _.each(features, function(feature) {
    var model = null;
    switch(feature.class) {
      case 'ocm.Circle':
        model = new ocm.models.Circle(feature);
        break;
      case 'ocm.Line':
        model = new ocm.models.Line(feature);
        model.set('points', new ocm.models.GeometryCollection());
        buildPointCollection(model.get('points'), feature.points);
        break;
      case 'ocm.Point':
        model = new ocm.models.Point(feature);
        break;
      case 'ocm.Polygon':
        model = new ocm.models.Polygon(feature);
        model.set('points', new ocm.models.GeometryCollection());
        buildPointCollection(model.get('points'), feature.points);
        break;
      case 'ocm.Rectangle':
        model = new ocm.models.Rectangle(feature);
        model.set('points', new ocm.models.GeometryCollection());
        buildPointCollection(model.get('points'), feature.points);
        break;
    }
    if(model) {
      geometryCollection.add(model);
    }
  });

  return geometryCollection;
};



/**
 * The application router.
 *
 * @constructor
 * @extends {Backbone.Router}
 */
ocm.Router = Backbone.Router.extend({
  /**
   * Routes for the application.
   *
   * @type {Object.<string, string>}
   */
  routes: {
    '(/):id(/)': 'loadMap'
  },

  /**
   * The current map that is loaded.
   *
   * @type {ocm.models.Map}
   */
  map: null,

  /**
   * Route execution method for a map load.
   */
  loadMap: function(id) {
    if(!this.map || this.map.get('id') != id) {
      var model = this.map = new ocm.models.Map({id: id});
      model.fetch({
        success: function() {
          // Publish the new map model to notify views.
          model.set(
            'features',
            ocm.featureArrayToGeometryCollection(model.get('features')));
          Backbone.trigger(ocm.Topics.MAP_CHANGED, model);
        }
      });
    }
  }
});
