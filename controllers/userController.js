const bcrypt = require('bcryptjs');
const { decode } = require('jsonwebtoken');

const User = require('../models/userModel');
const { createToken, generateHash, verifyToken, generateOtp } = require('../utils/utils');

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

const createOtpCode = (userOtp) => {
  const otp = userOtp || Math.floor(Math.random() * (1000000 - 100000) + 100000);
  return otp;
};

exports.verify = async (req, res, next) => {
  try {
    let user = req.session.newUser;
    // Check if there is user data in session
    if (!user)
      return res.status(401).json({
        status: 'Error',
        message: `unauthorized, Please login first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
      });
    // check if the user post his Otp
    if (!req.body.otp || isNaN(req.body.otp))
      return res.status(401).json({
        status: 'Error',
        message: `Please Provide a valid OTP code`,
      });

    // Check if the token in Session is valid
    const decodeToken = await verifyToken(user.token);

    if (!decodeToken)
      return res.status(401).json({
        status: 'Error',
        message: `unauthorized, Please login first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`, // Find another message to show
      });

    // Timer
    const unixTime = Math.floor(Date.now() / 1000);
    const remainTime = decodeToken.exp - unixTime + 2;

    // OTP
    let otp = createOtpCode(user.otp);

    let otpFailure = user.otpFailure || 0;

    if (otp === req.body.otp) return res.status(401).json({ status: 'success' });

    otpFailure = otpFailure + 1;

    if (otpFailure === 3) {
      otp = createOtpCode();
      otpFailure = 0;
    }

    user = req.session.newUser = { ...user, otp, otpFailure };

    return res.status(200).json({
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
