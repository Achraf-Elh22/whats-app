const bcrypt = require('bcryptjs');

const { generateOtp } = require('../utils/utils');

exports.signup = async (req, res) => {
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
      country: undefined,
    };

    // save the user in session
    req.session.newUser = newUser;

    return res.status(200).json({
      status: 'success',
      message: `Please verify your account in ${req.protocol}://${req.headers.host}/api/v1/user/verify`,
    });
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message });
  }
};

// Sign up Error
// DB:
// handle the deplicated key error

exports.verify = async (req, res) => {
  try {
    // OTP
    let user = req.session.newUser;
    let { otp, otpFailure } = req.session.newUser;

    if (user.otp === req.body.otp)
      return res.status(200).json({ status: 'success', message: 'OTP CORRECT 👌👌👌' });

    otpFailure = otpFailure + 1; // The first try give you only 2 chances of Giving correct OTP before regenarate another one

    if (otpFailure === 3) {
      otp = generateOtp();
      otpFailure = 0;
      user = req.session.newUser = { ...user, otp, otpFailure };
      return res.status(401).json({
        status: 'error',
        message: 'You made 3 consecutive Wrong OTP, we will resend to you new OTP code',
      });
    }

    user = req.session.newUser = { ...user, otp, otpFailure };

    console.log(user.otp, req.body.otp);
    return res.status(401).json({
      status: 'error',
      message: "Wrong OTP, please repeat again if you didn't receive the OTP code Click Resend",
    });
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err.message, err);
    res.status(409).json({ status: 'error', message: err.message, error: err });
  }
};
// verify Error:
// JWT expired

exports.login = (req, res, next) => {
  res.status(501).json({
    status: 'Not Implemented',
    data: null,
  });
};
