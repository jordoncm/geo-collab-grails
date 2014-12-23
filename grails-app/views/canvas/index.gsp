<!DOCTYPE html>
<html lang="en">
  <head>
    <link href="//cdnjs.cloudflare.com/ajax/libs/bootcards/1.0.0/css/bootcards-desktop.min.css" rel="stylesheet" />
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet" />
    <link href="//cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" rel="stylesheet" />
    <link href="//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.css" rel="stylesheet" />
    <asset:stylesheet href="canvas.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title>geo-collab</title>
  </head>
  <body>
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand no-break-out" href="/ocm/home">geo-collab</a>
        </div>
        <div class="navbar-text pull-left" id="map-title"></div>
        <div class="navbar-text pull-right" id="active-editors"></div>
      </div>
    </div>
    <div id="map"></div>
    <script type="text/javascript">
var URL_BASE = '${createLink(uri: "")}';
    </script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/bootcards/1.0.0/js/bootcards.min.js"></script>
    <script src="//cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
    <script src="//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.js"></script>
    <asset:javascript src="canvas.js" />
  </body>
</html>
