/**
 * Created by razvant on 09.09.2016.
 */
'use strict';

module.exports = {
  dist: {
    options: {
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseBooleanAttributes: true,
      removeCommentsFromCDATA: true
    },
    files: [{
      expand: true,
      cwd: '<%= yeoman.dist %>',
      src: ['*.html'],
      dest: '<%= yeoman.dist %>'
    }]
  }
};
