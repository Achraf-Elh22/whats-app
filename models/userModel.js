const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profile: {
    userName: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: 5,
      maxlength: 25,
      unique: true,
      required: [true, 'Please Provide a User Name'],
    },
    phoneNumber: {
      type: Number,
      unique: true,
      min: 7,
      max: 15,
      required: [true, 'Please Provide a Number Phone'],
    },
    countryCode: String,
    photo: {
      type: String,
      default: 'default.jpg',
    },
    description: {
      type: String,
      maxlength: 50,
      default: "Can't talk, WhatsApp only",
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, 'Please Provide a Password'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
