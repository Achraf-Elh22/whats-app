const ConfigStore = require('conf');
const argv = require('minimist')(process.argv.slice(2));
const { prompt } = require('./prompt');
const { setAutoAuth } = require('./utilities');

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

// Config Store
const config = new ConfigStore({ accessPropertiesByDotNotation: false });

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
prompt(defaultAnswers);
