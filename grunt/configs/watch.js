/**
 * Created by razvant on 08.09.2016.
 * Watches files for changes and runs tasks based on the changed files
 */
'use strict';

module.exports = {
  bower: {
    files: ['bower.json'],
    tasks: ['wiredep']
  },
  js: {
    files: ['<%= yeoman.app %>/scripts/**/*.js'],
    tasks: ['eslint']
  },
  css: {
    files: ['<%= yeoman.app %>/scripts/**/*.scss',
      '<%= yeoman.app %>/styles/scss/*.scss'
    ],
    tasks: ['concat', 'sass', 'postcss']
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  options: {
    event: ['changed', 'added', 'deleted']
  }
};
