const User = require('../models/userModel');
const { isEmail } = require('validator');
const { telNumber, passwordStrength } = require('../utils/validation');

// Check if the phoneNumber is Number
const phone = async (phoneNumber, country) => {
  if (isNaN(phoneNumber)) {
    return { isValidTel: false, internationalFormat: '' };
  }
  return await telNumber(phoneNumber, country);
};

exports.signup = async (req, res, next) => {
  const { phoneNumber, email, password, country } = req.body;

  // check if the email, password,phoneNumber
  if (!phoneNumber || !email || !password)
    return res.status(400).json({
      status: 'error',
      message: `Please provide the necessary information "phoneNumber, email, password" `,
    });

  // check if the user exist in DB
  const user = await User.findOne({ 'profile.phoneNumber': phoneNumber });
  if (user) return res.status(409).json({ status: 'error', message: 'This User already exist' });

  // Validate the phone Number number
  const { isValidTel, internationalFormat } = await phone(phoneNumber, country);
  if (!isValidTel)
    return res
      .status(400)
      .json({ status: 'error', message: `Please provide a valid Phone Number` });

  // Validate Email
  if (!isEmail(email))
    return res.status(400).json({ status: 'error', message: `Please provide a valid Email` });

  // Check the strenght of password
  const ctr = passwordStrength(password);
  if (password.length < 8 || ctr < 3)
    return res.status(400).json({
      status: 'error',
      message: `Please choose a strong password it need to be at least 8 characters and contains letters, number, and symbols`,
    });

  // Add International number format (+212622088092)
  req.body.internationalFormat = internationalFormat.replace(/\s/g, '');
  next();
};
