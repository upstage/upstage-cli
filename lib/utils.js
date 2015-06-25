'use strict';

var path = require('path');
var fs = require('fs');

var utils = module.exports = {};

/**
 * Find branches for a specified directory by reading in all the files/directories
 * within the specified directory.
 * This is used in `.git` directories.
 *
 * ```
 * var branches = utils.branches('./.git/branches');
 * //=> ['gh-pages', 'master']
 * ```
 *
 * @param  {String} `dir` Directory to check for branches.
 * @return {Array} Array of found branches.
 */

utils.branches = function branches (dir) {
  if (!fs.existsSync(dir)) return [];
  if (!fs.statSync(dir).isDirectory()) return [];
  return fs.readdirSync(dir);
};

/**
 * Determine of the specified `repo` and `remote` combination contains
 * the specified `branch`.
 *
 * ```
 * utils.hasBranch(repo, 'origin', 'gh-pages', function (err, has) {
 *   if (err) return console.error(err);
 *   console.log('Has Branch:', has);
 * });
 * ```
 *
 * @param  {Object} `repo` Repo object returned by `gift`
 * @param  {String} `remote` Name of the remote to check.
 * @param  {String} `branch` Name of the branch to check for.
 * @param  {Function} `cb` Callback function that takes an `err` and `has` Boolean.
 * @api public
 */

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

/**
 * Load a configuration object for the specified `repo`.
 * Configuration may come from `package.json#{configProp}` or
 * from a configuration file with one of the following formats:
 *
 *   - `.{configProp}`
 *   - `.{configProp}rc`
 *   - `{configProp}.rc`
 *   - `{configProp}.json`
 *   - `{configProp}.yaml`
 *
 * ```
 * utils.readConfig(repo, 'upstage', function (err, config) {
 *   if (err) return console.error(err);
 *   console.log(config);
 * });
 * ```
 *
 * @param  {Object} `repo` Repo object returned by `gift`
 * @param  {String} `configProp` Optional configration property to use when checking in `package.json` and finding configuration files.
 * @param  {Function} `cb` Callback function that takes an `err` and `config` object.
 * @api public
 */

utils.readConfig = function readConfig (repo, configProp, cb) {
  cb(null, {});
};

