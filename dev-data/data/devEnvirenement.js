#! /usr/bin/node

'use strict';
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const mongoose = require('mongoose');
const fs = require('fs');
const delay = require('delay');
const Configstore = require('conf');

// Config Store
const config = new Configstore({ accessPropertiesByDotNotation: false });

// Models
const User = require('../../models/userModel');
const Contact = require('../../models/contactModel');
const Conversation = require('../../models/conversationModel');
const Message = require('../../models/messageModel');

/*-----------------------------------Temparary---------------------------------------------------------------*/
let responses = {
  imported_data: 'all',
  mongoDB_URI:
    'mongodb+srv://AchrafElh22:yxI9Fs4AzqCRYPlr@cluster0.2qzql.mongodb.net/whats-app?retryWrites=true&w=majority',
  auto_login: false,
};
/*-----------------------------------------------------------------------------------------------------------*/

// Args --import
const questions = [
  //   ImportedData => options = ['USERS', 'CONTACTS', 'CONVERSATIONS', 'MESSAGES']
  {
    type: 'list',
    name: 'imported_data',
    message: chalk.greenBright('Which data you want to import   ?'),
    choices: ['USERS', 'CONTACTS', 'CONVERSATIONS', 'MESSAGES', new inquirer.Separator(), 'ALL'],
    filter(input) {
      return input.toLowerCase();
    },
  },
  //   DataBase information (URI)
  {
    type: 'input',
    name: 'mongoDB_URI',
    message: chalk.greenBright('Your mongoDB URI :'),
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

// Phase One : Collect the information
const defaultAnswers = config.get('defaultResponses');

inquirer
  .prompt(questions, defaultAnswers)
  // Pass to next phase
  .then((answers) => new PhaseTwo(answers).EntryTask())
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

// PHASE 2: COLLECT, CONNECT, IMPORT
class PhaseTwo {
  constructor(responses) {
    this.res = responses;
  }

  // Task One: Collect Information giving in the Phase One
  async EntryTask() {
    // Store default answers in configstore
    if (this.res.default_answers) {
      config.set({ defaultResponses: this.res });

      console.log('///////////////////////////////////////////');
      console.log('Imported data using the default :');
      console.log(chalk.cyanBright(`DATA TO IMPORT:`), `${this.res.imported_data}`);
      console.log(chalk.cyanBright(`MONGODB URI: `), `${this.res.mongoDB_URI}`);
      console.log(chalk.cyanBright(`AUTO LOGIN: `), `${this.res.auto_login}`);
      console.log('///////////////////////////////////////////');
    }
    await delay(3000);

    const task = ora('Collect Information').start();

    // Check if imported_data and mongodb_uri are specified
    await delay(2000);
    if (!this.res.imported_data || !this.res.mongoDB_URI)
      return task.fail('please Provide the information necessary to continue');

    task.succeed('Collect Information (completed ✅)');
    return this.taskTwo();
  }

  // Task Two: Connect to Db through mongoose connection
  async taskTwo() {
    const task = ora('Connect to DB').start();

    //   Close any open mongoDb connection
    await mongoose.connection.close();

    // Connect to DB
    try {
      await require('../../config/db')(this.res.mongoDB_URI);

      if (mongoose.connection.readyState === 0) {
        return task.fail('SomeThing went wrong trying to connect to DB 💣💣💣');
      }

      if (mongoose.connection.readyState === 1) {
        task.succeed('Connect to DB (completed ✅)');
        return this.taskThree();
      }
    } catch (err) {
      task.fail(err);
    }
  }

  // Import Data: this func create doc in mongo depend on the type(users, conversations, contacts, messages or all)
  async importData(data) {
    return new Promise(async (resolve, reject) => {
      // Delete documents from collections if there is any
      await User.deleteMany();
      await Contact.deleteMany();
      await Conversation.deleteMany();
      await Message.deleteMany();

      // Import all collections to DB
      const importAll = () => ({
        users: JSON.parse(fs.readFileSync(`${__dirname}/users.json`)),
        conversations: JSON.parse(fs.readFileSync(`${__dirname}/conversations.json`)),
        contacts: JSON.parse(fs.readFileSync(`${__dirname}/contacts.json`)),
        messages: JSON.parse(fs.readFileSync(`${__dirname}/messages.json`)),
      });

      //  Data to import to DB
      const dataToImport =
        data === 'all' ? importAll() : JSON.parse(fs.readFileSync(`${__dirname}/${data}.json`));

      try {
        if (data === 'users') await User.create(dataToImport);
        else if (data === 'contacts') await Contact.create(dataToImport);
        else if (data === 'conversations') await Conversation.create(dataToImport);
        else if (data === 'messages') await Message.create(dataToImport);
        else if (data === 'all')
          await Promise.all([
            User.create(dataToImport.users),
            Contact.create(dataToImport.contacts),
            Conversation.create(dataToImport.conversations),
            Message.create(dataToImport.messages),
          ]);
        else reject(`invalid data to import : ${data}`);

        resolve(dataToImport);
      } catch (err) {
        reject(err);
      }
    });
  }

  async taskThree() {
    const task = ora('Import data').start();
    try {
      // Import Data
      await this.importData(this.res.imported_data);

      task.succeed('Import data (completed ✅)');
      process.exit(0);
    } catch (err) {
      task.fail('Something went wrong (wrong ❌) ');
      console.error(err);
    }
  }
}

// Set user.id
class PhaseThree {}

const printHelp = () => {
  console.log;
};

// TODO: automation script:
//- [x] Save development data
//- [ ] initiate development environment like user.id
//- [ ] Arguments
//-     [ ] Be able to specify wich data to save in arguments
//-     [ ] reset the configstore
//-     [ ] specify new data without deleting configStore
//- [ ] notes:
//-     [ ] it's preferable to use devolopement DB because data exists in collection(users, messages, contact, conversations) will be delete it.
//-     [ ] Pasword123 in console REPEL
