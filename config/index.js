const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  IPINFOTOKEN: 'b896d8680909d3',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRESIN: process.env.JWT_EXPIRESIN,
};
