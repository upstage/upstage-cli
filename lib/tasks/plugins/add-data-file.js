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
  var fn = options.data;
  if (typeof fn !== 'function') {
    fn = dataFn(fn);
  }

  return through.obj(passthrough, function (cb) {
    var stream = this;
    fn(function (err, data) {
      if (err) {
        stream.emit('error', err);
        cb();
        return;
      }
      var filename = path.join(base, '_data', name);
      var file = new File({
        cwd: cwd,
        base: base,
        path: path.resolve(cwd, filename),
        contents: new Buffer(yaml.dump(data))
      });
      stream.push(file);
      cb();
    });
  });
}

function passthrough (file, enc, cb) {
  this.push(file);
  cb();
}

function dataFn(data) {
  return function (cb) {
    cb(null, data);
  };
}

