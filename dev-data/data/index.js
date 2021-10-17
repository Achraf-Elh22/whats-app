#! /usr/bin/node
'use strict';

const ConfigStore = require('conf');
const argv = require('minimist')(process.argv.slice(2));
const { importPrompt, deletePrompt } = require('./prompt');
const { setAutoAuth } = require('./utilities');

// Config Store
const config = new ConfigStore({ accessPropertiesByDotNotation: false });

// args: --import
// purpose: import specifique data to mongodb
if (argv['import']) {
  let defaultAnswers;

  if (argv['reset-config'] || argv.R) {
    // Reset ConfigStore
    // by deleting default resoponses
    config.delete('defaultResponses');
  } else if (argv['new-config'] || argv.N) {
    // New responses with out deleting default
    defaultAnswers = undefined;
  } else {
    // Default responses saved in configStore
    defaultAnswers = config.get('defaultResponses');
  }

  // Call the prompt with default answers, if the argument -R or -N exists defaultAnswers will equal to undefined
  importPrompt(defaultAnswers);
}
// args: --delete
// purpose: delete specifique data from mongodb
if (argv['delete']) {
  //   deleted Items can be = ['USERS', 'CONTACTS', 'CONVERSATIONS', 'MESSAGES', "ALL"]
  deletePrompt();
}

// Utilitis
// Set auto-auth to start script in package.json
if (argv['set-auto-auth']) {
  setAutoAuth();
  process.exit(0);
}

// remove auto-auth to start script in package.json
if (argv['remove-auto-auth']) {
  setAutoAuth(false);
  process.exit(0);
}
