/**
 * Created by razvant on 09.09.2016.
 * ng-annotate tries to make the code safe for minification automatically
 * by using the Angular long form for dependency injection.
 */
'use strict';

module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: 'public/.tmp/concat/scripts',
      src: '*.js',
      dest: 'public/.tmp/concat/scripts'
    }]
  }
};
