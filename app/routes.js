'use strict';

var Menu = require('./models/menu');
var User = require('./models/user');
var path = require('path');
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
          userDetails: request.session.user.userDetails,
          role: request.session.user.role,
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
  app.post('/updateUserDetails', function (request, response) {
    var userDetails = request.body;

    User.findOneAndUpdate({username: request.session.user.username}, {userDetails: userDetails}, {new: true}, function (error, user) {
      if (error) throw error;

      response.json(user.userDetails);
    });
  });

  // update the password from the profile page
  app.post('/updatePassword', function (request, response) {
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
                  User.where({username: request.session.user.username}).update({$set: {password: hash}}, function (error, res) {
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
    }
  );

  // application
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'index.html'));
  });
};
