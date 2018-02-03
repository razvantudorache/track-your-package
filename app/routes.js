'use strict';

var Menu = require('./models/menu');
var User = require('./models/user');
var path = require('path');
var requireLogin = require('./requireLogin');

module.exports = function (app) {



  /*************************************************
   * API
   *************************************************/

  // get user details based on the username and password
  app.post('/login', function (req, res) {
    var userData = req.body;
    User.findOne(
      {
        username: userData.username,
        password: userData.password
      },
      function (error, user) {
        //handle error
        if (error) throw error;

        if (user) {
          req.session.user = user;
          res.json({
            success: true
          });
        } else {
          res.json({
            message: 'Username or password incorrect!',
            success: false
          });
        }
      }
    );
  });

  app.get('/dashboard', requireLogin, function (req, res) {
    Menu.findOne(
      {
        type: req.session.user.role
      },
      function (error, menu) {
        //handle error
        if (error) throw error;
        var response = {
          userDetails: req.session.user.userDetails,
          role: req.session.user.role,
          menuEntries: menu.menuEntries,
          success: true
        };

        res.json(response);
      });
  });

  app.get('/logout', function(req, res) {
    req.session.destroy();
    res.json({success: true});
  });

  // application
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
  });
};
