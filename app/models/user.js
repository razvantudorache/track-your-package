'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "username": {
    type: String,
    unique: true
  },
  "password": String,
  "firstName": String,
  "lastName": String,
  "address": String,
  "email": String,
  "phone": Number,
  "companyID": Number,
  "role": String
});

userSchema.plugin(mongoosePaginate);

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj._id;
  return obj;
};

var User = mongoose.model('User', userSchema, 'Users');

module.exports = User;
