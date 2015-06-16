/*!
 * ghp <https://github.com/doowb/ghp>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var extend = require('extend-shallow');
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
  console.log('\n === Running === ');
  console.log(dirs.join('\n'));
  console.log(argv);
  console.log(' =============== \n');

  var options = extend({
    templates: path.join(__dirname, 'lib', 'templates')
  }, argv);

  var tasks = dirs.map(function (dir) {
    return path.basename(path.resolve(dir));
  }).filter(Boolean);

  tasks.forEach(function (task) {
    gulp.task('build-' + task, build(extend({}, options)));
    gulp.task('push-' + task, push(extend({}, options)));
    gulp.task(task, ['build-' + task, 'push-' + task]);
  });

  gulp.run(tasks, function () {
    console.log('finished gulp.run', arguments);
    done(null);
  });
};

module.exports = Application();
