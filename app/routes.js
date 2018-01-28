'use strict';
// load the menu model
var Menu = require('./models/menu');
var User = require('./models/user');
var path = require('path');

module.exports = function (app) {

  // api
  // get user details based on the username and password
  app.get('/api/user', function (req, res) {
    var userData = req.query;
    User.find(
      {
        username: userData.username,
        password: userData.password
      },
      function (error, data) {
        if (error) throw error;

        if (data.length) {
          var user = data[0]._doc;
          Menu.find(
            {
              type: user.role
            },
            function (error, data) {
              if (error) throw error;

              var response = {
                userDetails: user.userDetails,
                success: true
              };

              response.userDetails.menuEntries =  data[0]._doc.menuEntries;

              res.json(response);
            });
        } else {
          res.json({
            message: 'Username or password incorrect!',
            success: false
          })
        }
      }
    );

  });

  // application
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
  });
};
