const { generateOtp } = require('../utils/utils');
const User = require('../models/userModel');

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
    // Check if  the user is in the right stage
    if (user.stage !== 'verify')
      return res.status(401).json({
        status: 'Error',
        message: `unauthorized, Please signup first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
      });

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
        stage: 'createProfile',
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

exports.profile = async (req, res, next) => {
  let { email, phoneNumber, password, stage } = req.session.newUser;
  const { username, description } = req.body;

  // Check if there is user data in session and if the user is in the right stage
  if (stage !== 'createProfile')
    return res.status(401).json({
      status: 'Error',
      message: `unauthorized, Please signup first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
    });

  if (!req.body || !username)
    return res.status(400).json({
      status: 'Error',
      message: `Please provide a valid Information`,
    });

  // Check if the username allready exist
  if (await User.findOne({ 'profile.username': username }))
    // return res.status(400).json({
    //   status: 'Error',
    //   message: `User Name is all ready exists, choose another one.`,
    // });

    // create The newUser

    const newUser = await User.create({
      profile: { email, phoneNumber, password, username, photo: req.file.filename, description },
    });

  // res.status(200).json({
  //   status: 'Every Thing is good, Now you could try to find a friend.',
  //   data: newUser,
  // });
};

exports.login = (req, res, next) => {
  res.status(501).json({
    status: 'Not Implemented',
    data: null,
  });
};
