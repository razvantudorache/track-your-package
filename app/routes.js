'use strict';
// load the menu model
var Menu = require('./models/menu');
var path = require('path');

module.exports = function (app) {

  // api
  // get user entries based on the role
  app.get('/api/menu', function (req, res) {

    Menu.find({ type: 'admin' }, function(err, data) {
      if (err) throw err;

      console.log(data);
      res.json(data[0]);
    });
  });

  // application
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
  });
};
