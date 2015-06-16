'use strict';

var through = require('through2');
var yaml = require('js-yaml');
var File = require('vinyl');
var path = require('path');

module.exports = function (options) {
  var name = options.name;
  if (name.indexOf('.') === -1) {
    name = name += '.yaml';
  }
  var cwd = options.cwd;
  var data = options.data;

  return through.obj(passthrough, function (cb) {
    var file = new File({
      cwd: cwd,
      path: path.join('_data', name),
      contents: new Buffer(yaml.dump(data))
    });
    this.push(file);
    cb();
  });
}

function passthrough (file, enc, cb) {
  this.push(file);
  cb();
}
