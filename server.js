/**
 * Main server file for starting the server and setting up the routing for the apis.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    w = require('winston'),
    Routes = require(__dirname + '/routing'),
    redis = require('redis');

app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 5000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

// Routing paths.
var routes = new Routes(app);

http.createServer(app).listen(app.get('port'), function(){
    w.info("Express server listening on port " + app.get('port'));
});

