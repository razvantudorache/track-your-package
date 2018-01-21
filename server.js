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

app.use(express.static(__dirname + '/public'));
app.use('/scripts',  express.static(path.join(__dirname, 'scripts')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());

// routes
require('./app/routes.js')(app);

// listen (start app with node server.js)
app.listen(port);
console.log("App listening on port " + port);
