const User = require('../models/userModel');
const { isEmail } = require('validator');
const { telNumber } = require('../utils/validation');

// Check if the phoneNumber is Number
const phone = async (phoneNumber, country) => {
  if (isNaN(phoneNumber)) {
    return { isValidTel: false, internationalFormat: '' };
  }
  return await telNumber(phoneNumber, country);
};

exports.signup = async (req, res, next) => {
  try {
    const { phoneNumber, email, password, country } = req.body;

    // check if the email, password,phoneNumber
    if (!phoneNumber || !email || !password)
      return res.status(400).json({
        status: 'error',
        message: `Please provide the necessary information "phoneNumber, email, password" `,
      });

    // Validate the phone Number number
    const { isValidTel, internationalFormat } = await phone(phoneNumber, country);
    if (!isValidTel)
      return res
        .status(400)
        .json({ status: 'error', message: `Please provide a valid Phone Number` });

    // Validate Email
    if (!isEmail(email))
      return res.status(400).json({ status: 'error', message: `Please provide a valid Email` });

    // check if the user exist in DB
    const user = await User.findOne({ 'profile.phoneNumber': phoneNumber });
    if (user) return res.status(409).json({ status: 'error', message: 'This User already exist' });

    // Create User
    const newUser = {
      ...req.body,
      phoneNumber: internationalFormat.replace(/\s/g, ''),
      country: undefined,
    };

    await User.create({ profile: newUser });

    return res.status(200).json({ status: 'Success', data: newUser });
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err.message);
    res.status(409).json({ status: 'error', message: err.message });
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
