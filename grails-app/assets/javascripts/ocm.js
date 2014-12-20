//= require ocm/models.js
//= require ocm/views.js

var ocm = ocm || {};


/**
 * The URL base for the REST interface.
 *
 * @const {string}
 */
ocm.URL_BASE = URL_BASE + '/';


/**
 * The REST URLs for the application.
 *
 * @enum {string}
 */
ocm.RestUrls = {
  CIRCLE: ocm.URL_BASE + 'circle',
  LINE: ocm.URL_BASE + 'line',
  POINT: ocm.URL_BASE + 'point',
  POLYGON: ocm.URL_BASE + 'polygon',
  RECTANGLE: ocm.URL_BASE + 'rectangle',
  MAP: ocm.URL_BASE + 'map',
  STATE: ocm.URL_BASE + 'state',
  VIEW: ocm.URL_BASE + 'view'
};


/**
 * The topic URLs for the socket communication.
 *
 * @enum {string}
 */
ocm.SocketUrls = {
  CREATED: '/topics/created',
  DELETED: '/topics/deleted'
};


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
   * The stomp client.
   *
   * @type {Stomp}
   */
  socket: null,

  /**
   * Setup the stomp client static property.
   */
  initialize: function() {
    this.socket = Stomp.over(new SockJS(ocm.URL_BASE + '/stomp'));
    // Connect and subscribe to channels.
    this.socket.connect({}, _.bind(function() {
      this.socket.subscribe(ocm.SocketUrls.CREATED, function(message) {
        console.log(JSON.parse(message.body));
      });
      this.socket.subscribe(ocm.SocketUrls.DELETED, function(message) {
        console.log(JSON.parse(message.body));
      });
    }, this));
  },

  /**
   * Route execution method for a map load.
   */
  loadMap: function(id) {
    if(!this.map || this.map.get('id') != id) {
      this.map = new ocm.models.Map({id: id});
      this.map.fetch({
        success: _.bind(function() {
          // Publish the new map model to notify views.
          this.map.set(
            'features',
            ocm.featureArrayToGeometryCollection(this.map.get('features')));

          this.listenTo(this.map.get('features'), 'destroy', function(model) {
            this.socket.send(
              ocm.SocketUrls.DELETED,
              {},
              JSON.stringify(_.omit(model.toJSON(), 'map')));
          });
          this.listenTo(this.map.get('features'), 'sync', function(model) {
            this.socket.send(
              ocm.SocketUrls.CREATED,
              {},
              JSON.stringify(_.omit(model.toJSON(), 'map')));
          });

          Backbone.trigger(ocm.Topics.MAP_CHANGED, this.map);
        }, this)
      });
    }
  }
});
