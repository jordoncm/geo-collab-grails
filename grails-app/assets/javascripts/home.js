//= require thirdparty/underscore.js
//= require thirdparty/backbone.js

//= require ocm.js

$(function() {
  new ocm.views.Create();
  (new ocm.views.MapList()).render();
});
