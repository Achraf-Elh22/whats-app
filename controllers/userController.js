const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  try {
    // Create User
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      profile: {
        ...req.body,
        password: hashPassword,
        phoneNumber: req.body.internationalFormat,
        country: undefined,
      },
    });

    return res.status(200).json({ status: 'success', data: newUser });
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err.message);
    res.status(409).json({ status: 'error', message: err.message, error: err });
  }
};

// Sign up Error
// DB:
// handle the deplicated key error
exports.login = (req, res, next) => {
  res.status(501).json({
    status: 'Not Implemented',
    data: null,
  });
};
