const { generateOtp } = require('../utils/utils');
const sendSMS = require('../utils/sendSMS');

exports.generateOtp = (req, res, next) => {
  const user = req.session.newUser;
  console.log('generate Otp');
  otp = user.otp || generateOtp();

  let otpFailure = user.otpFailure || 0;

  req.session.newUser = { ...user, otp, otpFailure };

  let SMSTextTemplete = `WHATSAPP Demo OTP code : ${otp} valid for 5 min`;
  if (otpFailure === 0) sendSMS(user.phoneNumber, SMSTextTemplete);

  next();
};
