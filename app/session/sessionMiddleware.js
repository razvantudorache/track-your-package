'use strict';
var User = require('../models/user');

module.exports = function (app) {
  // global middleware will be check every request
  app.use(function (req, res, next) {
    if (req.session && req.session.user) {
      User.findOne({username: req.session.user.username}, function (err, user) {
        if (user) {
          req.user = user;
          delete req.user.password; // delete the password from the session
          req.session.user = user;  //refresh the session value
          res.locals.user = user;
        }
        // finishing processing the middleware and run the route
        next();
      });
    } else {
      next();
    }
  });
};
