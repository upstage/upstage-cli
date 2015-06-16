'use strict';

var path = require('path');
var gulp = require('gulp');
var extend = require('extend-shallow');

module.exports = function (options) {
  var opts = options || {};
  opts.cwd = opts.cwd || process.cwd();
  opts.src = opts.src || path.join(opts.templates, '**/*');
  opts.dest = opts.dest || path.join(opts.cwd, '_gh_pages');

  return function build () {
    // console.log('build opts', opts);
    return gulp.src(opts.src)
      // TODO process templates
      .pipe(gulp.dest(opts.dest));
  };
}
