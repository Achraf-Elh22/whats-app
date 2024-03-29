const chalk = require('chalk');
const inquirer = require('inquirer');
const ImportDevData = require('./importDevData');
const { deleteDoc } = require('./utilities');

const prompt = (defaultAnswers, callback, questions) =>
  inquirer
    .prompt(questions, defaultAnswers)
    // Pass to next phase
    .then((answers) => callback(answers) || answers)
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        process.stderr.write("Prompt couldn't be rendered in the current environment");
        process.exit(2);
      } else {
        // Something else went wrong
        process.stderr.write(
          chalk.red(error, ', Please check the help manual by adding --help args')
        );
      }
    });

// Args --import
const ImportQuestions = [
  //   ImportedData => options = ['USERS', 'CONTACTS', 'CONVERSATIONS', 'MESSAGES', "ALL"]
  {
    type: 'list',
    name: 'imported_data',
    message: chalk.greenBright('Which data you want to import ?'),
    choices: ['USERS', 'CONTACTS', 'CONVERSATIONS', 'MESSAGES', new inquirer.Separator(), 'ALL'],
    filter(input) {
      return input.toLowerCase();
    },
  },
  //   DataBase information (URI)
  {
    type: 'input',
    name: 'mongoDB_URI',
    message: chalk.greenBright('Your development mongoDB URI: '),
    validate: (input) => {
      // Empty input
      if (input == '') {
        console.log(chalk.red('Please provide URI for your mongodb cluster'));
        return false;
      }

      return true;
    },
  },
  // set User.id as param to login automaticaly
  {
    type: 'confirm',
    name: 'auto_login',
    message: chalk.greenBright('Do you want to set user.id to login automaticaly ?'),
    default: true,
  },
  // set answers obtained to default by persist them to configStore
  {
    type: 'confirm',
    name: 'default_answers',
    message: chalk.greenBright('Do you want to set your responses as default for the next time ?'),
  },
];

// Args --delete
const deleteQuestions = [
  //   options => ['USERS', 'CONTACTS', 'CONVERSATIONS', 'MESSAGES', "all"]
  {
    type: 'list',
    name: 'delete_data',
    message: chalk.greenBright('Which data you want to delete ?'),
    choices: ['USERS', 'CONTACTS', 'CONVERSATIONS', 'MESSAGES', new inquirer.Separator(), 'ALL'],
    filter(input) {
      return input.toLowerCase();
    },
  },
  //   DataBase information (URI)
  {
    type: 'input',
    name: 'mongoDB_URI',
    message: chalk.greenBright('Your development mongoDB URI: '),
    validate: (input) => {
      // Empty input
      if (input == '') {
        console.log(chalk.red('Please provide URI for your mongodb cluster'));
        return false;
      }

      return true;
    },
  },
];

exports.importPrompt = (defaultAnswers) =>
  prompt(defaultAnswers, (answers) => new ImportDevData(answers).EntryTask(), ImportQuestions);

exports.deletePrompt = () =>
  prompt(
    undefined,
    ({ delete_data, mongoDB_URI }) => deleteDoc(delete_data, mongoDB_URI),
    deleteQuestions
  );
