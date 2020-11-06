const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  profile: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Please Provide a Email'],
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Please Provide a Number Phone'],
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, 'Please Provide a Password'],
      select: false,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: 5,
      maxlength: 25,
      unique: true,
      required: [true, 'Please Provide a User Name'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    description: {
      type: String,
      maxlength: 50,
      default: "Can't talk, WhatsApp only",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.profile.password = await bcrypt.hash(this.profile.password, 12);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
