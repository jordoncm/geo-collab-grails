//= require thirdparty/underscore.js
//= require thirdparty/backbone.js

//= require ocm.js

$(function() {
  (new ocm.views.Map()).render();
  new ocm.Router();
  Backbone.history.start();
});
