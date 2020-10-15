const Nexmo = require('nexmo');
const { NEXMO_APIKEY, NEXMO_APISECRET } = require('../config/index.js');

const sendSMS = (to, text) => {
  const nexmo = new Nexmo({
    apiKey: NEXMO_APIKEY,
    apiSecret: NEXMO_APISECRET,
  });

  const from = 'WhatsApp';

  nexmo.message.sendSms(from, to, text);
};

module.exports = sendSMS;
