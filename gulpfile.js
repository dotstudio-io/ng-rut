/* jshint node: true */
'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var del = require('del');

var paths = {
  source: 'src/**/*.js',
  dest: 'dist/'
};

gulp.task('clean', function(next) {
  del(paths.dest, next);
});

gulp.task('build', ['clean'], function() {
  return gulp.src(paths.source).

  pipe(sourcemaps.init()).
  pipe(uglify()).
  pipe(sourcemaps.write()).
  pipe(rename({
    suffix: '.min'
  })).
  pipe(gulp.dest(paths.dest));

});

gulp.task('watch', function() {
  gulp.watch(paths.source, ['build']);
});

gulp.task('default', ['watch', 'build']);
