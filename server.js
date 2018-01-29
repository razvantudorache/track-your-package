'use strict';

// set up variables
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var database = require('./config/database');
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 3000;

// configuration
mongoose.connect(database.url);

// load resources from the distribution folder on the production
if (!process.env.PRODUCTION) {
  app.use(express.static(__dirname + '/public'));
} else {
  app.use(express.static(__dirname + '/public/dist'));
}

app.use('/scripts',  express.static(path.join(__dirname, 'scripts')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(bodyParser.json());

// session config
require('./app/session/sessionConfig')(app);
// session middleware
require('./app/session/sessionMiddleware')(app);
// routes
require('./app/routes')(app);

// listen (start app with node server.js)
app.listen(port);
console.log("App listening on port " + port);
