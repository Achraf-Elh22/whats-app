const bcrypt = require('bcryptjs');

const { generateOtp } = require('../utils/utils');
const Email = require('../utils/Email');
const sendSMS = require('../utils/sendSMS');

exports.saveUserInSession = async (req, res, next) => {
  try {
    // Create User
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    // Initialize the time of session
    const initDate = Math.floor(Date.now() / 1000);
    const expDate = initDate + 5 * 60 + 1;

    const newUser = {
      ...req.body,
      password: hashPassword,
      phoneNumber: req.body.internationalFormat,
      expDate,
      sendBy: 'EMAIL', // default value is SMS, but could change by the user to Email
      country: undefined,
    };

    // save the user in session
    req.session.newUser = newUser;

    next();
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message });
  }
};

exports.generateCode = async (req, res, next) => {
  try {
    const user = req.session.newUser;

    let otpCode = user.otpCode || generateOtp();

    let otpFailure = user.otpFailure || 0;
    let consecutiveFailure = user.consecutiveFailure || 0;

    req.session.newUser = { ...user, otpCode, otpFailure, consecutiveFailure };

    next();
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message });
  }
};

exports.send = async (req, res, next) => {
  try {
    const user = req.session.newUser;
    if (user.otpFailure === 0) {
      console.log('SEND');
      let SMSTextTemplete = `WHATSAPP Demo OTP code : ${user.otpCode} valid for 5 min`;
      const email = new Email(user, `${user.otpCode}`);
      user.sendBy === 'SMS'
        ? sendSMS(user.phoneNumber, SMSTextTemplete)
        : email.sendMail('verify', 'Verify User');
    }
    next();
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message });
  }
};
