/**
 * Created by razvant on 09.09.2016.
 */
'use strict';

module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= yeoman.app %>/images',
      src: '{,*/}*.{png,jpg,jpeg,gif}',
      dest: '<%= yeoman.dist %>/images'
    }]
  }
};
