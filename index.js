/*!
 * ghp <https://github.com/doowb/ghp>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var merge = require('merge-deep');
var path = require('path');
var gulp = require('gulp');

var build = require('./lib/tasks/build');
var push = require('./lib/tasks/push');

function Application () {
  if (!(this instanceof Application)) {
    return new Application();
  }
}

Application.prototype.run = function(dirs, argv, done) {
  var options = merge({
    templates: path.join(__dirname, 'lib', 'templates')
  }, argv);

  var tasks = dirs.map(function (dir) {
    return {
      cwd: path.resolve(dir),
      name: path.basename(path.resolve(dir))
    };
  }).filter(Boolean);

  tasks.forEach(function (task) {
    gulp.task('build-' + task.name, build(merge({}, {cwd: task.cwd}, options)));
    gulp.task('push-' + task.name, ['build-' + task.name], push(merge({}, {cwd: task.cwd}, options)));
    gulp.task(task.name, ['build-' + task.name, 'push-' + task.name]);
  });

  gulp.start.apply(gulp, tasks.map(prop('name')).concat(done));
};

function prop(key) {
  return function (obj) {
    return obj[key];
  };
}

module.exports = Application();
