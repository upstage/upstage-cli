'use strict';

var path = require('path');
var fs = require('fs');

var utils = module.exports = {};

utils.branches = function branches (dir) {
  if (!fs.existsSync(dir)) return [];
  if (!fs.statSync(dir).isDirectory()) return [];
  return fs.readdirSync(dir);
};

utils.hasBranch = function hasBranch (repo, remote, branch, cb) {
  var base = repo.path || process.cwd();
  repo.remote_fetch(remote, function (err) {
    if (err) return cb(err);
    if (fs.existsSync(path.join(base, '.git'))) {
      if (utils.branches(path.join(base, '.git', 'branches')).indexOf(branch) !== -1) {
        return cb(null, true);
      }
      if (utils.branches(path.join(base, '.git', 'refs', 'remotes', remote)).indexOf(branch) !== -1) {
        return cb(null, true);
      }
      return cb(null, false);
    }
    cb(null, false);
  });
};

