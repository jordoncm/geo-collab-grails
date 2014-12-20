//= require spring-websocket
//= require thirdparty/underscore.js
//= require thirdparty/backbone.js

//= require ocm.js

$(function() {
  (new ocm.views.Map()).render();
  new ocm.Router();
  Backbone.history.start();

  /*
  var socket = new SockJS(ocm.URL_BASE + '/stomp');
  var client = Stomp.over(socket);

  client.connect({}, function() {
    client.subscribe('/topic/hello', function(message) {
      console.log(JSON.parse(message.body));
    });
  });
  var go = function() {
    client.send('/topic/hello', {}, JSON.stringify({foo: 'bar'}));
  };
  setTimeout(go, 2000);
  */
});
