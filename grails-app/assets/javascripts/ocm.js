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
  DELETED: '/topics/deleted',
  REGISTER: '/app/register',
  REGISTER_ACK: '/topics/register-ack',
  HEARTBEAT: '/app/heartbeat',
  HEARTBEAT_ACK: '/topics/heartbeat-ack'
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
  var geometryCollection = new ocm.models.GeometryCollection();
  _.each(features, function(feature) {
    var model = ocm.featureToGeometry(feature);
    if(model) {
      geometryCollection.add(model);
    }
  });

  return geometryCollection;
};


/**
 * Convert an object of feature data into a geometry model.
 *
 * @param {Object.<string, *>}
 * @return {ocm.models.Geometry}
 */
ocm.featureToGeometry = function(feature) {
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
  return model;
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
   * The id of the map editor.
   *
   * @type {number}
   */
  editorId: null,

  /**
   * Interval for maintaining heartbeat with server.
   *
   * @type {number}
   */
  interval: null,

  /**
   * Setup the stomp client static property.
   */
  initialize: function() {
    this.socket = Stomp.over(new SockJS(ocm.URL_BASE + '/stomp'));
    // Connect and subscribe to channels.
    this.socket.connect({}, _.bind(function() {
      this.socket.subscribe(ocm.SocketUrls.CREATED, _.bind(function(message) {
        var data = JSON.parse(message.body);
        if(!this.map.get('features').get(data.id)) {
          var model = ocm.featureToGeometry(data);
          this.map.get('features').add(model);
        }
      }, this));
      this.socket.subscribe(ocm.SocketUrls.DELETED, _.bind(function(message) {
        var data = JSON.parse(message.body);
        this.map.get('features').remove(this.map.get('features').get(data.id));
      }, this));

      this.socket.subscribe(
        ocm.SocketUrls.REGISTER_ACK,
        _.bind(function(message) {
          if(!this.editorId) {
            var data = JSON.parse(message.body);
            if(this.map && this.map.get('id') == data.map) {
              this.editorId = data.id;
            }
          }
        }, this));

      this.socket.subscribe(
        ocm.SocketUrls.HEARTBEAT_ACK,
        _.bind(function(message) {
          if(this.editorId) {
            var data = JSON.parse(message.body);
            if(this.editorId == data.id) {
              if(this.map && this.map.get('id') == data.map) {
                console.log(data);
              }
            }
          }
        }, this));

        this.socket.send(
          ocm.SocketUrls.REGISTER,
          {},
          JSON.stringify(this.map.get('id')));
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

          if(this.interval) {
            window.clearInterval(this.interval);
          }
          this.editorId = null;

          if(this.socket.connected) {
            this.socket.send(
              ocm.SocketUrls.REGISTER,
              {},
              JSON.stringify(this.map.get('id')));
          }

          this.interval = window.setInterval(_.bind(function() {
            this.socket.send(
              ocm.SocketUrls.HEARTBEAT,
              {},
              JSON.stringify(JSON.stringify({id: this.editorId, mapId: this.map.get('id')})));
          }, this), 500);

          Backbone.trigger(ocm.Topics.MAP_CHANGED, this.map);
        }, this)
      });
    }
  }
});
