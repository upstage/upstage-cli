'use strict';

var path = require('path');
var gulp = require('gulp');
var rimraf = require('rimraf');
var merge = require('merge-deep');
var lookup = require('lookup-path');
var parent = require('glob-parent');
var addRelated = require('./plugins/add-related-data');
var addDataFile = require('./plugins/add-data-file');

module.exports = function (options) {
  var opts = merge({}, options);
  opts.cwd = opts.cwd || process.cwd();
  opts.src = opts.src || path.join(opts.templates, '**/*');
  opts.dest = opts.dest || path.join(opts.cwd, '.upstage');

  // find current package.json
  var pkgPath = lookup('package.json', opts.cwd);
  var pkg = {};
  try {
    pkg = require(pkgPath);
  } catch (err) {
    console.log('package.json not found for', opts.cwd);
  }
  var pkgFile = {
    cwd: opts.cwd,
    base: parent(opts.src),
    name: 'pkg',
    data: pkg
  };

  return function build (done) {
    rimraf(opts.dest, function (err) {
      if (err) return done(err);
      gulp.src(opts.src)
        .pipe(addDataFile(pkgFile))
        .pipe(addRelated(opts.cwd, parent(opts.src), pkg))
        // TODO process templates
        .pipe(gulp.dest(opts.dest))
        .on('error', done)
        .on('end', done)
        .on('data', sink);
    });
  };

  function sink () {}
}
