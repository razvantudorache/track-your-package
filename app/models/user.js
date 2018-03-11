'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var saltRounds = 10;

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
  delete obj._v;
  return obj;
};

userSchema.pre('save', function (next) {
  var user = this;

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

var User = mongoose.model('User', userSchema, 'Users');

module.exports = User;
