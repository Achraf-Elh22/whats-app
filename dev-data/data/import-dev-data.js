const fs = require('fs');
const dotenv = require('dotenv');

const User = require('../../models/userModel');
const Contact = require('../../models/contactModel');
const Conversation = require('../../models/conversationModel');
const Message = require('../../models/messageModel');

// Connect to DB
dotenv.config({ path: '../../config/config.env' });
require('../../config/db')(process.env.MONGO_URI);

// Password => password123
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const contacts = JSON.parse(fs.readFileSync(`${__dirname}/contact.json`));
const conversations = JSON.parse(fs.readFileSync(`${__dirname}/conversation.json`));
const messages = JSON.parse(fs.readFileSync(`${__dirname}/messages.json`));

// Import Data
const importData = async () => {
  // await User.create(users);
  // await Contact.create(contacts);
  await Conversation.create(conversations);
  // await Message.create(messages);
  process.exit(1);
};

// Delete Data
const deleteData = async () => {
  // await User.deleteMany();
  // await Contact.deleteMany();
  await Conversation.deleteMany();
  // await Message.deleteMany();
  process.exit(1);
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
