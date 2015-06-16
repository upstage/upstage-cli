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
  var base = options.base;
  var data = options.data;

  return through.obj(passthrough, function (cb) {
    var filename = path.join(base, '_data', name);
    var file = new File({
      cwd: cwd,
      base: base,
      path: path.resolve(cwd, filename),
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
