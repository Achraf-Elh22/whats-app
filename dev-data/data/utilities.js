const fs = require('fs');
const mongoose = require('mongoose');
const ora = require('ora');
const chalk = require('chalk');
const { modifyJson } = require('../../utils/utils');

// models
const User = require('../../models/userModel');
const Contact = require('../../models/contactModel');
const Conversation = require('../../models/conversationModel');
const Message = require('../../models/messageModel');

//  set or unset autoAuth argument from start script located in package.json
exports.setAutoAuth = async (autoAuth = true) => {
  const script = autoAuth ? 'nodemon server.js --auto-auth' : 'nodemon server.js';
  const { stderr, stdout } = await modifyJson(
    '../../package.json',
    `this.scripts.start="${script}"`
  );

  return { stderr, stdout };
};

// Import Data: this func create doc in mongo depend on the type(users, conversations, contacts, messages or all)
exports.importData = async (data) => {
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
};

// Connect to Db
exports.connectToDb = async (mongoDB_URI) => {
  //   Close any open mongoDb connection
  await mongoose.connection.close();

  // Connect to DB
  try {
    await require('../../config/db')(mongoDB_URI);

    if (mongoose.connection.readyState === 0) {
      return {
        status: 'error',
        message: ' SomeThing went wrong trying to connect to DB 💣💣💣  => ',
      };
    }

    if (mongoose.connection.readyState === 1) {
      return { status: 'success', message: ' Connect to DB (completed ✅) ' };
    }
  } catch (err) {
    return { status: 'error', message: ' => ' + err };
  }
};

// delete document from Mongodb
exports.deleteDoc = async (item, mongoDB_URI) => {
  const task = ora(`Delete ${item.toUpperCase()} Documents from Db`).start();

  try {
    const { status, message } = await this.connectToDb(mongoDB_URI);

    if (status === 'success') task.text = chalk.bgBlueBright(message);
    if (status === 'error') task.fail(chalk.bgBlueBright(message));

    if (item === 'users') await User.deleteMany();
    else if (item === 'contacts') await Contact.deleteMany();
    else if (item === 'conversations') await Conversation.deleteMany();
    else if (item === 'messages') await Message.deleteMany();
    else if (item === 'all')
      await Promise.all([
        User.deleteMany(),
        Contact.deleteMany(),
        Conversation.deleteMany(),
        Message.deleteMany(),
      ]);

    task.succeed(`${item.toUpperCase()} Documents are deleted successfully from DB`);

    process.exit(0);
  } catch (err) {
    task.fail(`Some thing went wrong trying to delete ${item} document => ${err}`);
  }
};
