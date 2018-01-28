'use strict';

var mongoose = require('mongoose');
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

var User = mongoose.model('User', userSchema, 'Users');

module.exports = User;
