const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
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
      select: false,
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
  { timestamps: true }
);

// Virtuals
userSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: 'participants',
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
