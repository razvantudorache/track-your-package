'use strict';

var Menu = require('./models/menu');
var User = require('./models/user');
var path = require('path');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var requireLogin = require('./requireLogin');

module.exports = function (app) {


  /*************************************************
   * API
   *************************************************/

  // get user details based on the username and password
  app.post('/login', function (request, response) {
    var userData = request.body;
    User.findOne(
      {
        username: userData.username
      },
      function (error, user) {
        //handle error
        if (error) throw error;

        if (user) {
          user.comparePassword(userData.password).then(function (res) {
            if (res) {
              request.session.user = user;
              response.json({
                success: true
              });
            } else {
              response.json({
                message: 'Username or password incorrect!',
                success: false
              });
            }
          });
        } else {
          response.json({
            message: 'Username or password incorrect!',
            success: false
          });
        }
      }
    );
  });

  // get the user details for the authenticated user
  app.get('/dashboard', requireLogin, function (request, response) {
    Menu.findOne(
      {
        type: request.session.user.role
      },
      function (error, menu) {
        //handle error
        if (error) throw error;

        var responseObject = {
          userDetails: request.session.user,
          menuEntries: menu.menuEntries,
          success: true
        };

        response.json(responseObject);
      });
  });

  // remove the user from the session
  app.get('/logout', function (request, response) {
    request.session.destroy();
    response.json({success: true});
  });

  // update the user details from the profile page
  app.post('/updateUserDetails', requireLogin, function (request, response) {
    var userDetails = request.body;

    User.findOneAndUpdate({username: request.session.user.username}, {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      phone: userDetails.phone
    }, {new: true}, function (error, user) {
      if (error) throw error;

      response.json(user.toJSON());
    });
  });

  // update the password from the profile page
  app.post('/updatePassword', requireLogin, function (request, response) {
    var oldPassword = request.body.oldPassword;
    var newPassword = request.body.newPassword;

    User.findOne({
      username: request.session.user.username
    }, function (error, user) {
      if (error) throw error;

      if (user) {
        user.comparePassword(oldPassword).then(function (res) {
          if (res) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
              bcrypt.hash(newPassword, salt, function (err, hash) {
                User.findOneAndUpdate({username: request.session.user.username}, {password: hash}, function (error, res) {
                    response.json({
                      success: true,
                      message: 'Password changed successfully!'
                    });
                });
              });
            });
          } else {
            response.json({
              success: false,
              message: 'Username or old password not match!'
            });
          }
        });
      } else {
        response.json({
          success: false,
          message: 'Username or old password not match!'
        });
      }
    });
  });

  // get the list with users
  app.get('/userList', requireLogin, function (request, response) {
    var params = {
      offset: parseInt(request.query.start),
      limit: parseInt(request.query.limit)
    };

    if (request.session.user.role !== 'courier') {
      var options = {};
      if (request.session.user.role === 'admin') {
        options = {
          companyID: request.session.user.companyID
        }
      }

      User.paginate(options, params, function (error, result) {
        if (result) {
          for (var i = 0; i < result.docs.length; i++) {
            result.docs[i] = result.docs[i].toJSON();
          }
        } else {
          result = {};
        }

        response.json(result);
      })
    } else {
      response.sendStatus(401);
    }
  });

  // application
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
  });
};
