/**
 * @fileoverview Views for the application.
 */

_.templateSettings = {
  evaluate: /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  escape: /\{\{-([\s\S]+?)\}\}/g
};

var ocm = ocm || {};
ocm.views = {};



/**
 * Maintain the active editor count.
 *
 * @constructor
 * @extends {Backbone.View}
 */
ocm.views.ActiveEditors = Backbone.View.extend({
  /**
   * The jQuery target for the view.
   *
   * @type {string}
   */
  el: '#active-editors',

  /**
   * Setup publish/subscribe listeners for the view.
   */
  initialize: function() {
    Backbone.on(ocm.Topics.EDITORS, this.render, this);
  },

  render: function(count) {
    switch(count) {
      case 1:
        this.$el.html('1 editor');
        break;
      default:
        this.$el.html(count + ' editors');
        break;
    }
    return this;
  }
});



/**
 * The map creation view.
 *
 * @constructor
 * @extends {Backbone.View}
 */
ocm.views.Create = Backbone.View.extend({
  /**
   * The jQuery target for the view.
   *
   * @type {string}
   */
  el: '#create-panel',

  /**
   * Events for the view.
   *
   * @type {Object.<string, string>}
   */
  events: {
    'click button': 'createMap',
    'submit form': 'createMap'
  },

  /**
   * Creates a new map by reading the user form and redirects the browser on
   * success.
   */
  createMap: function() {
    var attributes = {};
    // Only add attributes from the form if set.
    if($('#create-name').val()) {
      attributes.name = $('#create-name').val();
    }
    if($('#create-description').val()) {
      attributes.name = $('#create-description').val();
    }
    var map = new ocm.models.Map(attributes);
    map.save(null, {
      success: function() {
        window.location = '/ocm/canvas/#/' + map.get('id') + '/';
      }
    });

    return false;
  }
});



/**
 * The map list view.
 *
 * @constructor
 * @extends {Backbone.View}
 */
ocm.views.MapList = Backbone.View.extend({
  /**
   * The jQuery target for the view.
   *
   * @type {string}
   */
  el: '#maps',

  /**
   * Compiled template for the view.
   *
   * @type {function(Object.<string, *>)}
   */
  template: null,

  /**
   * Fetches the collection of maps and renders a card list.
   *
   * @return {ocm.views.MapList} For chaining.
   */
  render: function() {
    this.template = this.template || _.template($('#template-map-item').html());
    var collection = new ocm.models.MapCollection();
    collection.fetch({
      success: _.bind(function() {
        collection.each(_.bind(function(map) {
          this.$el.append(this.template({
            url_base: '/ocm/canvas',
            id: map.get('id'),
            name: map.get('name'),
            description: map.get('description')
          }));
        }, this));
      }, this)
    });

    return this;
  }
});



/**
 * Maintain the map name.
 *
 * @constructor
 * @extends {Backbone.View}
 */
ocm.views.MapTitle = Backbone.View.extend({
  /**
   * The jQuery target for the view.
   *
   * @type {string}
   */
  el: '#map-title',

  /**
   * Setup publish/subscribe listeners for the view.
   */
  initialize: function() {
    Backbone.on(ocm.Topics.MAP_CHANGED, this.changeMap, this);
  },

  changeMap: function(map) {
    this.render(map);
  },

  render: function(map) {
    this.$el.html(map.get('name'));
    return this;
  }
});



/**
 * The map view.
 *
 * @constructor
 * @extends {Backbone.View}
 */
ocm.views.Map = Backbone.View.extend({
  /**
   * The jQuery target for the view.
   *
   * @type {string}
   */
  el: '#map',

  /**
   * The current map model (fro creating new features).
   *
   * @type {ocm.models.Map}
   */
  map: null,

  /**
   * The active map canvas.
   *
   * @type {L.Map}
   */
  canvas: null,

  /**
   * Group of features for the map.
   *
   * @type {L.FeatureGroup}
   */
  featureGroup: null,

  /**
   * Setup publish/subscribe listeners for the view.
   */
  initialize: function() {
    Backbone.on(ocm.Topics.MAP_CHANGED, this.changeMap, this);
  },

  /**
   * Update the canvas to show the new map.
   */
  changeMap: function(map) {
    // Derender any objects on map.
    this.featureGroup.clearLayers();
    // Render the features in the collection onto the map.
    map.get('features').each(_.bind(function(feature) {
      this.featureGroup.addLayer(feature.toLeaflet());
    }, this));

    this.listenTo(map.get('features'), 'add', _.bind(function(feature) {
      this.featureGroup.addLayer(feature.toLeaflet());
    }, this));

    this.listenTo(map.get('features'), 'remove', _.bind(function(feature) {
      this.featureGroup.removeLayer(feature.toLeaflet());
    }, this));

    this.map = map;
  },

  /**
   * Create a geometry model from a given Leaflet object and save it to the
   * map.
   *
   * @param {(L.Marker|L.Path)} layer The Leaflet layer object.
   */
  createFromLeaflet: function(layer) {
    // Add the created layer to the feature group.
    this.featureGroup.addLayer(layer);
    // Create the model and save it.
    var model = ocm.models.Geometry.createFromLeaflet(
      layer, this.map.get('id'));
    // Sure it is in the maps client collection of features.
    this.map.get('features').add(model);
  },

  /**
   * Remove a given Leaflet object from the canvas and delete it from the map.
   *
   * @param {(L.Marker|L.Path)} layer The Leaflet layer object.
   */
  deleteFromLeaflet: function(layer) {
    this.featureGroup.removeLayer(layer);
    var model = this.map.get('features').find(function(feature) {
      return feature.toLeaflet() == layer;
    });
    if(model) {
      // Let the server cascade deletions to save on HTTP requests.
      model.destroy();
      this.map.get('features').remove(model);
    }
  },

  /**
   * Renders the map.
   *
   * @return {ocm.views.Map} For chaining.
   */
  render: function() {
    if(!this.canvas) {
      this.canvas = L.map(this.$el.get(0)).setView([38.895111, -77.036667], 6);
      L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        id: 'examples.map-i875mjb7'
      }).addTo(this.canvas);
      this.featureGroup = L.featureGroup().addTo(this.canvas);
      (new L.Control.Draw({
        edit: {
          featureGroup: this.featureGroup
        }
      })).addTo(this.canvas);

      this.canvas.on('draw:created', _.bind(function(e) {
        this.createFromLeaflet(e.layer);
      }, this));

      this.canvas.on('draw:deleted', _.bind(function(e) {
        // Loop through each of the deleted layers, find the models and call
        // for a deletion.
        e.layers.eachLayer(_.bind(function(layer) {
          this.deleteFromLeaflet(layer);
        }, this));
      }, this));

      this.canvas.on('draw:edited', _.bind(function(e) {
        e.layers.eachLayer(_.bind(function(layer) {
          // Delete and recreate each feauture that is edited. This prevents
          // issues when points are injected or removed within a complex
          // polygon during editing.
          this.deleteFromLeaflet(layer);
          this.createFromLeaflet(layer);
        }, this));
      }, this));
    }

    return this;
  }
});
