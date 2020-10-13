const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { JWT_SECRET } = require('../config/index.js');

exports.createToken = (value, expiresIn) => {
  return jwt.sign({ value }, JWT_SECRET, { expiresIn });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

exports.generateHash = (bytes) => {
  const id = crypto.randomBytes(bytes).toString('hex');
  const hash = crypto.createHash('sha256').update(id).digest('hex');
  return hash;
};

exports.generateOtp = (userOtp) => {
  const otp = Math.floor(Math.random() * (1000000 - 100000) + 100000);
  return otp;
};
