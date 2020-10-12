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

const createOtpCode = (user) => {
  const otp = user.otp || Math.floor(Math.random() * (1000000 - 100000) + 100000);
  return otp;
};

exports.verify = async (req, res, next) => {
  try {
    const user = req.session.newUser;
    if (!user)
      return res.status(401).json({
        status: 'success',
        message: `unauthorized, Please login first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
      });

    const decodeToken = await verifyToken(user.token);

    if (!decodeToken)
      return res.status(401).json({
        status: 'success',
        message: `unauthorized, Please login first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`, // Find another message to show
      });

    // Timer
    const unixTime = Math.floor(Date.now() / 1000);
    const remainTime = decodeToken.exp - unixTime + 2;
    // OTP
    let otp = createOtpCode(user);

    let otpFailure;
    if (!user.otp) {
      otpFailure = 0;
      req.session.newUser = { ...user, otp, otpFailure };
    }

    if (otp === req.body.otp) return res.status(401).json({ status: 'success' });

    otpFailure = otpFailure++;
    req.session.newUser = { ...user, otp, otpFailure };

    if (otpFailure === 3) {
      otp = createOtpCode();
    }

    return res.status(200).json({
      status: 'error',
      message: "Wrong OTP, please repeat again if you didn't receive the OTP code Click Resend",
      data: { user, remainTime, otp },
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
