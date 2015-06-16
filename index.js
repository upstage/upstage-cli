/*!
 * ghp <https://github.com/doowb/ghp>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var extend = require('extend-shallow');
var glob = require('globby');
var path = require('path');

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

  console.log('options', options);
};

module.exports = Application();
