const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    maxlength: 150,
    required: true,
  },
  contentType: {
    type: String,
    default: 'text',
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
