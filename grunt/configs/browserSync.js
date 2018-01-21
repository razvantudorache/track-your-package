/**
 * Created by razvant on 09.09.2016.
 */
'use strict';

module.exports = {
  files: ['<%= yeoman.app %>/styles/typ-all.css',
    '<%= yeoman.app %>/**/*.html', '<%= yeoman.app %>/**/*.js'],
  options: {
    watchTask: true,
    port: 3001
  }
};
