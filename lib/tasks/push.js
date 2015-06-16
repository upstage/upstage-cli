'use strict';

var path = require('path');
var gulp = require('gulp');
var ghpages = require('gulp-gh-pages');
var extend = require('extend-shallow');

var defaults = {
  remoteUrl: '',
  origin: '',
  branch: 'gh-pages',
  push: true,
  force: true
};


module.exports = function (options) {
  var opts = options || {};
  opts.cwd = opts.cwd || process.cwd();
  opts.src = opts.src || path.join(opts.cwd, '_gh_pages', '**/*');
  opts.cacheDir = opts.cacheDir || path.join(process.cwd(), '.publish');
  opts = extend(defaults, opts);

  return function push () {
    opts.message = opts.message || 'Rebuilding site ' + new Date().toISOString();
    console.log('push opts', opts);
    // return gulp.src(opts.src)
    //   .pipe(ghpages(opts));
  };
}
