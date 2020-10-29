const { generateOtp } = require('../utils/utils');

exports.signup = async (req, res) => {
  try {
    return res.status(200).json({
      status: 'success',
      message: `Please verify your account in ${req.protocol}://${req.headers.host}/api/v1/user/verify`,
      data: req.session.newUser,
    });
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message });
  }
};

//! Sign up Error
//! DB:
//! handle the deplicated key error

exports.verify = async (req, res) => {
  try {
    // OTP
    let user = req.session.newUser;
    let { otpCode, otpFailure, consecutiveFailure } = req.session.newUser;

    console.log(user.otpCode);

    // check if the user post his Otp

    if (!req.body.otpCode || isNaN(req.body.otpCode))
      return res.status(401).json({
        status: 'Error',
        message: `Please Provide a valid Verify code`,
      });

    if (user.otpCode === req.body.otpCode) {
      req.session.newUser = {
        ...user,
        otpCode: undefined,
        otpFailure: undefined,
        consecutiveFailure: undefined,
      };
      return res.status(200).json({ status: 'success', message: 'OTP CORRECT 👌👌👌' });
    }

    otpFailure = otpFailure + 1; // The first try give you only 2 chances of Giving correct OTP before regenarate another one

    if (otpFailure === 3) {
      otpCode = generateOtp();

      otpFailure = 0;
      consecutiveFailure += 1;
      user = req.session.newUser = { ...user, otpCode, otpFailure, consecutiveFailure };

      return res.status(401).json({
        status: 'error',
        message: 'You made 3 consecutive Wrong OTP, we will resend to you new OTP code',
      });
    }

    if (user.consecutiveFailure >= 3) {
      session.destroy(function () {
        console.log('TIMEOUT, SESSION HAS BEEN DESTROYED');
      });
    }

    user = req.session.newUser = { ...user, otpCode, otpFailure };

    return res.status(401).json({
      status: 'error',
      message: "Wrong OTP, please repeat again if you didn't receive the OTP code Click Resend",
      data: user,
    });
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err.message, err);
    res.status(409).json({ status: 'error', message: err.message, error: err });
  }
};

//! verify Error:
//! JWT expired

exports.profile = (req, res, next) => {
  res.status(501).json({
    status: 'Not Implemented',
    data: null,
  });
};

exports.login = (req, res, next) => {
  res.status(501).json({
    status: 'Not Implemented',
    data: null,
  });
};
