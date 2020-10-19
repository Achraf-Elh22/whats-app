const { generateOtp } = require('../utils/utils');
const Email = require('../utils/Email');
const sendSMS = require('../utils/sendSMS');

exports.generateOtp = (req, res, next) => {
  const user = req.session.newUser;
  otp = user.otp || generateOtp();

  let otpFailure = user.otpFailure || 0;
  let consecutiveFailure = user.consecutiveFailure || 0;

  req.session.newUser = { ...user, otp, otpFailure, consecutiveFailure };

  next();
};

exports.send = async (req, res, next) => {
  try {
    const user = req.session.newUser;
    if (user.otpFailure === 0) {
      console.log('SEND');
      let SMSTextTemplete = `WHATSAPP Demo OTP code : ${otp} valid for 5 min`;
      const email = new Email(user, 'http://127.0.0.1:3000/verify?token=gffgdgfdg');
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
