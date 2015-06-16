'use strict';

var path = require('path');
var gulp = require('gulp');
var ghpages = require('gulp-gh-pages');
var merge = require('merge-deep');
var Git = require('gulp-gh-pages/lib/git');
var git = require('gift');

var defaults = {
  origin: 'origin',
  branch: 'gh-pages',
  push: true,
  force: true
};

module.exports = function (options) {
  var opts = merge({}, options);
  opts.cwd = opts.cwd || process.cwd();
  opts.src = opts.src || path.join(opts.cwd, '_gh_pages', '**/*');
  opts.cacheDir = opts.cacheDir || path.join(opts.cwd, '.publish');
  opts = merge(defaults, opts);

  return function push (done) {
    opts.message = opts.message || 'Rebuilding site ' + new Date().toISOString();
    Git.getRemoteUrl(git(opts.cwd), opts.origin)
      .then(function (remoteUrl) {
        opts.remoteUrl = opts.remoteUrl || remoteUrl;
        gulp.src(opts.src)
          .pipe(ghpages(opts))
          .on('error', done)
          .on('end', done);
      })
      .catch(done);
  };
}
