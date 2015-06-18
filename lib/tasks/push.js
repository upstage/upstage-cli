'use strict';

var git = require('gift');
var path = require('path');
var gulp = require('gulp');
var rimraf = require('rimraf');
var merge = require('merge-deep');
var parent = require('glob-parent');
var ghpages = require('gulp-gh-pages');
var Git = require('gulp-gh-pages/lib/git');

var defaults = {
  origin: 'origin',
  branch: 'gh-pages',
  push: true,
  force: true
};

module.exports = function (options) {
  var opts = merge({}, options);
  opts.cwd = opts.cwd || process.cwd();
  opts.src = opts.src || path.join(opts.cwd, '.ghp', '**/*');
  opts.cacheDir = opts.cacheDir || path.join(opts.cwd, '.publish');
  opts = merge(defaults, opts);

  return function push (done) {
    var clean = function (err) {
      rimraf(parent(opts.src), function () {
        rimraf(opts.cacheDir, (err ? done.bind(done, err) : done));
      });
    }
    opts.message = opts.message || 'Rebuilding site ' + new Date().toISOString();
    Git.getRemoteUrl(git(opts.cwd), opts.origin)
      .then(function (remoteUrl) {
        opts.remoteUrl = opts.remoteUrl || remoteUrl;
        gulp.src(opts.src)
          .pipe(ghpages(opts))
          .on('data', sink)
          .on('error', clean)
          .on('end', clean);
      }, done);
  };
};

function sink () {}
