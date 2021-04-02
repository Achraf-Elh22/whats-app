const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const _ = require('underscore');

const conversationSchema = new mongoose.Schema(
  {
    groupeName: {
      type: String,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
      },
    ],
    type: {
      type: String,
      enum: ['private', 'groupe'],
    },
    photo: { type: String, default: 'default.jpg' },
    description: {
      type: String,
      maxLength: 125,
      default: 'Just some people hanging out',
    },
  },
  { timestamps: true }
);

// Paths
// add required validation to groupName and required only if the type is group
conversationSchema.path('groupeName').required(function () {
  return this.type === 'group';
}, 'The groupe name is required');

// virtuals
conversationSchema.virtual('lastMsg', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversationId',
  options: { sort: { createdAt: -1 } },
});

// Plugin
conversationSchema.plugin(uniqueValidator);

// Pre Hooks
// Validation to check that participant in conversation is unique
conversationSchema.pre('save', function (next) {
  this.participants = _.uniq(this.participants, (i) => (i._id ? i._id.toString() : i));
  return next();
});

conversationSchema.pre('save', function (next) {
  // Minimale Number of people allowed to creating is 3 participants
  if (this.type === 'group') {
    this.participants.length > 3
      ? next()
      : next(new Error('Group need to have more than Three participants'));
  }

  // Description and photo is only for the groups
  if (this.type === 'private') {
    this.description = undefined;
    this.photo = undefined;
  }

  return next();
});

// Sets
conversationSchema.set('toObject', { virtuals: true });
conversationSchema.set('toJSON', { virtuals: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
