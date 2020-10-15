const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const { createToken, generateHash, generateOtp } = require('../utils/utils');

exports.signup = async (req, res, next) => {
  try {
    // Create User
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    // Create Token
    const hash = generateHash(30);
    const token = createToken(hash, '15m');

    const newUser = {
      ...req.body,
      password: hashPassword,
      phoneNumber: req.body.internationalFormat,
      token,
      country: undefined,
    };

    // save the user in session
    req.session.newUser = newUser;

    return res.status(200).json({
      status: 'success',
      message: `Please verify your account in ${req.protocol}://${req.headers.host}/api/v1/user/verify`,
      data: newUser,
    });
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message });
  }
};

// Sign up Error
// DB:
// handle the deplicated key error

exports.verify = async (req, res, next) => {
  try {
    // OTP
    console.log(req.body);
    let user = req.session.newUser;
    let { otp, otpFailure } = req.session.newUser;

    if (user.otp === req.body.otp) return res.status(401).json({ status: 'success' });

    otpFailure = otpFailure + 1; // The first try give you only 2 chances if Giving correct OTP before regenarate another one

    if (otpFailure === 3) {
      otp = generateOtp();
      otpFailure = 0;
    }

    user = req.session.newUser = { ...user, otp, otpFailure };

    // Timer
    // const unixTime = Math.floor(Date.now() / 1000);
    // const remainTime = decodeToken.exp - unixTime + 2;

    return res.status(200).json({
      status: 'error',
      message: "Wrong OTP, please repeat again if you didn't receive the OTP code Click Resend",
      data: {
        user,
      },
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
