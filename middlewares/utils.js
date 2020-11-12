const bcrypt = require('bcryptjs');
const multer = require('multer');
const sharp = require('sharp');

const { generateOtp } = require('../utils/utils');
const Email = require('../utils/Email');
const sendSMS = require('../utils/sendSMS');

exports.saveUserInSession = async (req, res, next) => {
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
      sendBy: 'EMAIL', // default value is SMS, but could change by the user to Email
      country: undefined,
      stage: 'verify',
    };

    // save the user in session
    req.session.newUser = newUser;

    next();
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message, data: null });
  }
};

exports.generateCode = async (req, res, next) => {
  try {
    const user = req.session.newUser;

    let otpCode = user.otpCode || generateOtp();

    let otpFailure = user.otpFailure || 0;
    let consecutiveFailure = user.consecutiveFailure || 0;

    req.session.newUser = { ...user, otpCode, otpFailure, consecutiveFailure };

    next();
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message, data: null });
  }
};

exports.send = async (req, res, next, sendIt = false) => {
  try {
    let user = req.session.newUser;
    const { sendBy } = req.body || user;

    let SMSTextTemplete = `WHATSAPP Demo OTP code : ${user.otpCode} valid for 5 min`;
    const email = new Email(user);

    if (user.otpFailure === 0 || sendIt === true) {
      console.log('SEND');
      sendBy === 'SMS'
        ? sendSMS(user.phoneNumber, SMSTextTemplete)
        : email.verifyUser(`${user.otpCode}`);
    }
    if (sendIt === true) {
      user.sendBy = sendBy;
      req.session.newUser = { ...user };
      return res.status(200).json({
        status: 'success',
        message: `Check your ${sendBy === 'SMS' ? 'Phone' : 'Email'} The Code has been Send`,
      });
    }
    next();
  } catch (err) {
    console.error('something wrong happen 💣💣💣', err);
    res.status(409).json({ status: 'error', message: err.message, data: null });
  }
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only image'), false);
  }
};

exports.uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.resizeUserPhoto = async (req, res, next) => {
  // Check if the file exist
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${Date.now()}.jpeg`;

  // Resize the image
  await sharp(req.file.buffer)
    .resize(100, 100)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/assets/images/users/${req.file.filename}`);

  next();
};
