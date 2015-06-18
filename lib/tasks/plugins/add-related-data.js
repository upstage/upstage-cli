'use strict';

var addDataFile = require('./add-data-file');
var relatedList = require('helper-related');
module.exports = function (cwd, base, pkg) {
  var related = (pkg.meta && pkg.meta.related) || (pkg.dependencies && Object.keys(pkg.dependencies)) || [];
  var relatedFile = {
    cwd: cwd,
    base: base,
    name: 'related',
    data: function (cb) {
      relatedList({linkify: toLink})(related, function (err, content) {
        if (err) return cb(err);
        cb(null, { content: content });
      });
    }
  };
  return addDataFile(relatedFile);
};

/**
 * Link generation functions pulled from `helper-related` and
 * modified to generate html anchors instead of markdown links
 */

function toLink(pkg, num, words) {
  var res = '';
  res += link(pkg.name, pkg.homepage);
  res += truncate(pkg.description, pkg.homepage, words);
  if (num <= 1) return res;
  return '<li>' + res + '</li>';
}

function link(anchor, href, title) {
  title = title ? ' title="' + title + '"' : '';
  return '<a href="' + href + '"' + title + '>' + anchor + '</a>';
}

function truncate(description, homepage, words) {
  if (!description.length) return '';
  var arr = description.split(' ');
  var res = '';
  var max = 15;

  if (arr.length === 1) {
    return ': ' + arr[0];
  }
  if (words === false) {
    max = undefined;
  }
  if (typeof words === 'number') {
    max = words;
  }

  res = arr.slice(0, max).join(' ');

  if (res.length < description.length) {
    res += '… ' + link('more', homepage);
  }
  return ': ' + res;
}
