'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-deep');
var lookup = require('lookup-path');
var addRelated = require('./plugins/add-related-data');
var addDataFile = require('./plugins/add-data-file');

module.exports = function (options) {
  var opts = merge({}, options);
  opts.cwd = opts.cwd || process.cwd();
  opts.src = opts.src || path.join(opts.templates, '**/*');
  opts.dest = opts.dest || path.join(opts.cwd, '_gh_pages');

  // find current package.json
  var pkgPath = lookup('package.json', opts.cwd);
  var pkg = require(pkgPath);
  var pkgFile = {
    cwd: opts.cwd,
    name: 'pkg',
    data: pkg
  };

  return function build (done) {
    addRelated(opts.cwd, pkg, function (err, relatedStream) {
      if (err) return done(err);
      gulp.src(opts.src)
        .pipe(addDataFile(pkgFile))
        .pipe(relatedStream)
        // TODO process templates
        .pipe(gulp.dest(opts.dest))
        .on('data', sink)
        .on('error', done)
        .on('end', done);
    });
  };
}

function sink () {}
