'use strict';

/**
 * Apply this method for all the routes that require authentication
 * @param req
 * @param res
 * @param next
 */
var requireLogin = function (req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = requireLogin;
