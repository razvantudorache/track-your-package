/**
 * Created by razvant on 09.09.2016.
 * Automatically inject Bower components into the app
 */
'use strict';

module.exports = {
  app: {
    src: ['<%= yeoman.app %>/index.html'],
    ignorePath: /\.\.\//
  }
};
