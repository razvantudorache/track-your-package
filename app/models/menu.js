'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
  type: String,
  menuEntries: Array
});

var Menu = mongoose.model('Menu', menuSchema, 'Roles');

module.exports = Menu;
