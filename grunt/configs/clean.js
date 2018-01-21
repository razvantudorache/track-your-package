/**
 * Created by razvant on 09.09.2016.
 * Empties folders to start fresh
 */
'use strict';

module.exports = {
  dist: {
    files: [{
      dot: true,
      src: [
        '.tmp',
        '<%= yeoman.dist %>/{,*/}*',
        '!<%= yeoman.dist %>/.git{,*/}*'
      ]
    }]
  },
  server: '.tmp'
};
