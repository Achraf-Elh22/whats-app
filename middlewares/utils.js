const { generateOtp } = require('../utils/utils');

exports.generateOtp = (req, res, next) => {
  const user = req.session.newUser;
  otp = user.otp || generateOtp();

  let otpFailure = user.otpFailure || 0;

  req.session.newUser = { ...user, otp, otpFailure };

  next();
};
