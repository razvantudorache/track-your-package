'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "username": String,
  "password": String,
  "userDetails": {
    "firstName": String,
    "lastName": String,
    "address": String,
    "email": String,
    "phone": Number
  },
  "companyID": Number,
  "role": String
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

var User = mongoose.model('User', userSchema, 'Users');

module.exports = User;
