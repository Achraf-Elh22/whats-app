const fs = require('fs');
const dotenv = require('dotenv');

const User = require('../../models/userModel');

// Connect to DB
dotenv.config({ path: '../../config/config.env' });
require('../../config/db')(process.env.MONGO_URI);

// Password => password123
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

// Import Data
const importData = async () => {
  await User.create(users);
  process.exit(1);
};

// Delete Data
const deleteData = async () => {
  await User.deleteMany();
  process.exit(1);
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
