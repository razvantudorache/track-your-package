'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Menu = mongoose.model('Menu', new Schema({}), 'Roles');

module.exports = Menu;
