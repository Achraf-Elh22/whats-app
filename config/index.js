const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  IPINFOTOKEN: 'b896d8680909d3',
  MONGO_URI: process.env.MONGO_URI,
  NEXMO_APIKEY: process.env.NEXMO_APIKEY,
  NEXMO_APISECRET: process.env.NEXMO_APISECRET,
  EMAIL_FROM: process.env.EMAIL_FROM,
  MAILTRAP_HOST: process.env.MAILTRAP_HOST,
  MAILTRAP_PORT: process.env.MAILTRAP_PORT,
  MAILTRAP_AUTH_USER: process.env.MAILTRAP_AUTH_USER,
  MAILTRAP_AUTH_PASS: process.env.MAILTRAP_AUTH_PASS,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
