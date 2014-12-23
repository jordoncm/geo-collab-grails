//= require spring-websocket
//= require thirdparty/underscore.js
//= require thirdparty/backbone.js

//= require ocm.js

$(function() {
  (new ocm.views.Map()).render();
  new ocm.views.MapTitle();
  new ocm.views.ActiveEditors();
  new ocm.Router();
  Backbone.history.start();
});
