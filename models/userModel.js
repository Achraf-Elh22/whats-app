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
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, 'Please Provide a Password'],
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
      maxlength: 150,
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

userSchema.methods.validPassword = async function (password) {
  console.log(password, this.profile.password)
  
  return await bcrypt.compare(password, this.profile.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
