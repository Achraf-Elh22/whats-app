const fs = require('fs');
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
