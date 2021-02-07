const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    type: {
      type: String,
      enum: ['private', 'group'],
    },
    photo: { type: String, default: 'default.jpg' },
    description: {
      type: String,
      maxLength: 125,
    },
  },
  { timestamps: true }
);

// virtuals
conversationSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversationId',
});

conversationSchema.set('toObject', { virtuals: true });
conversationSchema.set('toJSON', { virtuals: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;

// TODO:
// Validations:
//  - Participants => should be unique
// - Type => MINIMALE USERS IS 3
// - Description => Only for the Groups
