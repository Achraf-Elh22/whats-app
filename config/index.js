const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
};
