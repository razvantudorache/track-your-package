/**
 * Created by razvant on 09.09.2016.
 * Copies remaining files to places other tasks can use
 */
'use strict';

module.exports= {
  dist: {
    files: [
      {
        expand: true,
        dot: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>',
        src: [
          '*.{ico,png,txt}',
          '*.html',
          'images/{,*/}*.{webp}',
          'styles/fonts/{,*/}*.*'
        ]
      },
      {
        expand: true,
        cwd: '.tmp/images',
        dest: '<%= yeoman.dist %>/images',
        src: ['generated/*']
      }
    ]
  },
  styles: {
    expand: true,
    cwd: '<%= yeoman.app %>/styles',
    dest: '.tmp/styles/',
    src: '{,*/}*.css'
  }
};
