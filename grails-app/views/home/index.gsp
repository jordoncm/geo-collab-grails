<!DOCTYPE html>
<html lang="en">
  <head>
    <link href="//cdnjs.cloudflare.com/ajax/libs/bootcards/1.0.0/css/bootcards-desktop.min.css" rel="stylesheet" />
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet" />
    <asset:stylesheet href="home.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title>geo-collab</title>
  </head>
  <body>
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand no-break-out" href="/ocm/home">geo-collab</a>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm-7 bootcards-cards">

          <div class="panel panel-default bootcards-richtext">
            <div class="panel-heading">
              <h3 class="panel-title">Realtime Geospatial Collaboration</h3>
            </div>
            <div class="panel-body">
              <p class="lead">Create and share simple maps in realtime.</p>
              <p>Create public maps designed to be editing in realtime by
              multiple authors and shared on the fly.</p>
              <p>Create a map below or choose from recent maps on the right.</p>
            </div>
          </div>

          <div id="create-panel" class="panel panel-default">
            <div class="panel-heading clearfix">
              <h3 class="panel-title pull-left">Create New Map</h3>
              <div class="btn-group pull-right">
                <button class="btn btn-success">
                  <i class="fa fa-check"></i>
                  Create
                </button>
              </div>
            </div>
            <div class="modal-body">
              <form class="form-horizontal">
                <div class="form-group">
                  <label class="col-xs-3 control-label">Name</label>
                  <div class="col-xs-9">
                    <input id="create-name" type="text" class="form-control" placeholder="Unnamed Map" />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-xs-3 control-label">Description</label>
                  <div class="col-xs-9">
                    <textarea id="create-description" class="form-control" rows="6" placeholder="No description provided."></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
        <div class="col-sm-5 bootcards-list">
          <div class="bootcards-list">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Recent Maps</h3>
              </div>
              <div id="maps" class="list-group"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script id="template-map-item" type="text/template">
<a class="list-group-item" href="{{- url_base }}/#/{{- id }}/">
  <h4 class="list-group-item-heading">{{- name }}</h4>
  <p class="list-group-item-text">{{- description }}</p>
</a>
    </script>

    <script type="text/javascript">
var URL_BASE = '${createLink(uri: "")}';
    </script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/bootcards/1.0.0/js/bootcards.min.js"></script>
    <asset:javascript src="home.js" />
  </body>
</html>
