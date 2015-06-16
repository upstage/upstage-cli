'use strict';

var path = require('path');
var gulp = require('gulp');
var ghpages = require('gulp-gh-pages');
var extend = require('extend-shallow');

module.exports = function (options) {
  var opts = extend({
    src: path.join(process.cwd(), '_gh_pages', '**/*.*'),
    cwd: process.cwd(),
    remoteUrl: '',
    origin: '',
    branch: 'gh-pages',
    cacheDir: path.join(process.cwd(), '.publish'),
    push: true,
    force: true
  }, options);

  return function () {
    opts.message = opts.message || 'Rebuilding site ' + new Date().toISOString();
    return gulp.src(opts.src)
      .pipe(ghpages(opts));
  };
}
