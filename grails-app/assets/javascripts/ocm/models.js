/**
 * @fileoverview Models for the application.
 */

var ocm = ocm || {};
ocm.models = {};



/**
 * Base class for geometry objects.
 *
 * @constructor
 * @extends {Backbone.Model}
 */
ocm.models.Geometry = Backbone.Model.extend({
  /**
   * Reference to this model local Leaflet object.
   *
   * @type {(L.Marker|L.Path)}
   */
  leaflet: null,

  /**
   * Create or fetch the Leaflet canvas object tied to this model.
   *
   * @return {(L.Marker|L.Path)}
   */
  toLeaflet: function() {}
}, {
  /**
   * Create a properly typed geometry model from a given Leaflet layer.
   *
   * NOTE: This will cause a sync with the server in order to generate ids and
   * create proper point relationships.
   *
   * @param {(L.Marker|L.Path)} layer The Leaflet layer to use.
   * @param {string} mapId The id of the map model to relate the geometry to.
   * @return {ocm.models.Geometry} The new geometry instance.
   */
  createFromLeaflet: function(layer, mapId) {
    var model = null;
    // Certain Leaflet objects extend from others, so order matters here when
    // detecting type.
    if(layer instanceof L.Marker) {
      model = ocm.models.Point.createFromLeaflet(layer, mapId);
    }
    if(layer instanceof L.Rectangle) {  // Extends L.Polygon.
      model = ocm.models.Rectangle.createFromLeaflet(layer, mapId);
    }
    if(layer instanceof L.Polygon) {  // Extends L.Polyline.
      model = ocm.models.Polygon.createFromLeaflet(layer, mapId);
    }
    if(layer instanceof L.Polyline) {  // Extends L.Path.
      model = ocm.models.Line.createFromLeaflet(layer, mapId);
    }
    if(layer instanceof L.Circle) {  // Extends L.Path.
      model = ocm.models.Circle.createFromLeaflet(layer, mapId);
    }
    return model;
  }
});



/**
 * A circle geometry.
 *
 * @constructor
 * @extends {ocm.models.Geometry}
 */
ocm.models.Circle = ocm.models.Geometry.extend({
  /**
   * @override
   */
  urlRoot: '/ocm/circle',

  /**
   * @override
   */
  defaults: {
    longitude: 0.0,
    latitude: 0.0,
    radius: 0.0
  },

  /**
   * @override
   */
  toLeaflet: function() {
    if(!this.leaflet) {
      this.leaflet = L.circle(
        [this.get('latitude'), this.get('longitude')],
        this.get('radius'));
    }
    return this.leaflet;
  }
}, {
  /**
   * @override
   */
  createFromLeaflet: function(layer, mapId) {
    var model = new ocm.models.Circle({
      map: {id: mapId},  // Weak reference on the client side so database
                         // relationship sets up properly.
      longitude: layer.getLatLng().lng,
      latitude: layer.getLatLng().lat,
      radius: layer.getRadius()
    });
    model.leaflet = layer;
    model.save();
    return model;
  }
});



/**
 * A line geometry.
 *
 * @constructor
 * @extends {ocm.models.Geometry}
 */
ocm.models.Line = ocm.models.Geometry.extend({
  /**
   * @override
   */
  urlRoot: '/ocm/line',

  /**
   * @override
   */
  toLeaflet: function() {
    if(!this.leaflet) {
      var latLngs = [];
      if(this.get('points')) {
        this.get('points').each(function(point) {
          latLngs.push(
            new L.latLng(point.get('latitude'), point.get('longitude')));
        });
      }
      this.leaflet = L.polyline(latLngs);
    }
    return this.leaflet;
  }
}, {
  /**
   * @override
   */
  createFromLeaflet: function(layer, mapId) {
    var model = new ocm.models.Line({
      map: {id: mapId}  // Weak reference on the client side so database
                        // relationship sets up properly.
    });
    model.leaflet = layer;
    model.save(null, {
      success: function() {
        model.set('points', new ocm.models.GeometryCollection());
        _.each(layer.getLatLngs(), function(latLng, i) {
          var point = new ocm.models.Point({
            parent: {id: model.get('id')},
            longitude: latLng.lng,
            latitude: latLng.lat,
            ord: i
          });
          point.save();
          model.get('points').add(point);
        });
      }
    });
    return model;
  }
});



/**
 * A point geometry.
 *
 * @constructor
 * @extends {ocm.models.Geometry}
 */
ocm.models.Point = ocm.models.Geometry.extend({
  /**
   * @override
   */
  urlRoot: '/ocm/point',

  /**
   * @override
   */
  defaults: {
    longitude: 0.0,
    latitude: 0.0,
    altitude: 0.0
  },

  /**
   * @override
   */
  toLeaflet: function() {
    if(!this.leaflet) {
      this.leaflet = L.marker([this.get('latitude'), this.get('longitude')]);
    }
    return this.leaflet;
  }
}, {
  /**
   * @override
   */
  createFromLeaflet: function(layer, mapId) {
    console.log(arguments);
    model = new ocm.models.Point({
      map: {id: mapId},  // Weak reference on the client side so database
                         // relationship sets up properly.
      longitude: layer.getLatLng().lng,
      latitude: layer.getLatLng().lat
    });
    model.leaflet = layer;
    model.save();
    return model;
  }
});



/**
 * A polygon geometry.
 *
 * @constructor
 * @extends {ocm.models.Geometry}
 */
ocm.models.Polygon = ocm.models.Geometry.extend({
  /**
   * @override
   */
  urlRoot: '/ocm/polygon',

  /**
   * @override
   */
  toLeaflet: function() {
    if(!this.leaflet) {
      var latLngs = [];
      if(this.get('points')) {
        this.get('points').each(function(point) {
          latLngs.push(
            new L.latLng(point.get('latitude'), point.get('longitude')));
        });
      }
      this.leaflet = L.polygon(latLngs);
    }
    return this.leaflet;
  }
}, {
  /**
   * @override
   */
  createFromLeaflet: function(layer, mapId) {
    var model = new ocm.models.Polygon({
      map: {id: mapId}  // Weak reference on the client side so database
                        // relationship sets up properly.
    });
    model.leaflet = layer;
    model.save(null, {
      success: function() {
        model.set('points', new ocm.models.GeometryCollection());
        _.each(layer.getLatLngs(), function(latLng, i) {
          var point = new ocm.models.Point({
            parent: {id: model.get('id')},
            longitude: latLng.lng,
            latitude: latLng.lat,
            ord: i
          });
          point.save();
          model.get('points').add(point);
        });
      }
    });
    return model;
  }
});



/**
 * A rectangle geometry.
 *
 * @constructor
 * @extends {ocm.models.Geometry}
 */
ocm.models.Rectangle = ocm.models.Geometry.extend({
  /**
   * @override
   */
  urlRoot: '/ocm/rectangle',

  /**
   * @override
   */
  toLeaflet: function() {
    if(!this.leaflet) {
      var latLngs = [];
      if(this.get('points')) {
        this.get('points').each(function(point) {
          latLngs.push(
            new L.latLng(point.get('latitude'), point.get('longitude')));
        });
      }
      this.leaflet = L.rectangle(latLngs);
    }
    return this.leaflet;
  }
}, {
  /**
   * @override
   */
  createFromLeaflet: function(layer, mapId) {
    var model = new ocm.models.Rectangle({
      map: {id: mapId}  // Weak reference on the client side so database
                        // relationship sets up properly.
    });
    model.leaflet = layer;
    model.save(null, {
      success: function() {
        model.set('points', new ocm.models.GeometryCollection());
        _.each(layer.getLatLngs(), function(latLng, i) {
          var point = new ocm.models.Point({
            parent: {id: model.get('id')},
            longitude: latLng.lng,
            latitude: latLng.lat,
            ord: i
          });
          point.save();
          model.get('points').add(point);
        });
      }
    });
    return model;
  }
});



/**
 * Collection of geometry objects.
 *
 * Client side construct only for grouping models together.
 *
 * @constructor
 * @extends {Backbone.Collection}
 */
ocm.models.GeometryCollection = Backbone.Collection.extend({
  /**
   * @override
   */
  comparator: 'ord',

  /**
   * @override
   */
  model: ocm.models.Geometry
});



/**
 * A map for containing features.
 *
 * @constructor
 * @extends {Backbone.Model}
 */
ocm.models.Map = Backbone.Model.extend({
  /**
   * @override
   */
  urlRoot: '/ocm/map',

  /**
   * @override
   */
  defaults: {
    name: 'Unnamed Map',
    description: 'No description provided.'
  }
});



/**
 * Collection of map objects.
 *
 * @constructor
 * @extends {Backbone.Collection}
 */
ocm.models.MapCollection = Backbone.Collection.extend({
  /**
   * @override
   */
  url: '/ocm/map',

  /**
   * @override
   */
  model: ocm.models.Map
});



/**
 * A state model for saving and sharing state between users.
 *
 * @constructor
 * @extends {Backbone.Model}
 */
ocm.models.State = Backbone.Model.extend({
  /**
   * @override
   */
  urlRoot: '/ocm/state',

  /**
   * @override
   */
  defaults: {
    view: null
  }
});



/**
 * A view focus for the map.
 *
 * @constructor
 * @extends {Backbone.Model}
 */
ocm.models.View = Backbone.Model.extend({
  /**
   * @override
   */
  urlRoot: '/ocm/view',

  /**
   * @override
   */
  defaults: {
    longitude: null,
    latitude: null,
    zoom: null
  }
});
