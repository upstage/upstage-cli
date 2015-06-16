#!/usr/bin/env node

var path = require('path');
var glob = require('glob');
var argv = require('minimist')(process.argv.slice(2));
var isGlob = require('is-glob');
var symbol = require('log-symbols');
var inquirer = require('inquirer');
var DataStore = require('data-store');
var flatten = require('arr-flatten');
var store = new DataStore('ghp');
var Questions = require('question-cache');
var questions = new Questions({inquirer: inquirer});
var app = require('./');

/**
 * Delete the global config store
 */

if (argv.store && argv.store === 'delete') {
  store.del({force: true});
  console.log(symbol.success, 'config store deleted.');
  process.exit();
}

/**
 * Directories to publish
 */

var patterns = argv._.length ? argv._[0] : './';
if (!isGlob(patterns) && patterns !== './') {
  patterns = patterns + '*/';
}
var dirs =  glob.sync(patterns);

// local project so just run immediately
if (dirs.length === 1 && dirs[0] === './') {
  return app.run(flatten(dirs), argv, done);
}

/**
 * Build choices from directories
 */

var choices = [{name: 'none', value: []}];
if (dirs.length > 1) {
  choices.push({name: 'All', value: dirs});
  choices.push(new inquirer.Separator('---'));
}
dirs.forEach(function(dir) {
  choices.push({ name: dir });
});

questions.set('dirs', {
  type: 'checkbox',
  choices: choices,
  message: 'Directories:'
});

questions.ask(['dirs'], function (err, answers) {
  handleError(err);
  if (flatten(answers.dirs).length === 0) {
    handleError('no directories selected');
  }

  app.run(flatten(answers.dirs), argv, done);
});

function done (err) {
  handleError(err);
  console.log(symbol.success, 'finished.');
  process.exit();
}

function handleError(err) {
  if (err) {
    console.error(symbol.error, err);
    process.exit(1);
  }
}
