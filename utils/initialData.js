const User = require('../models/userModel.js');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const { lastMsg } = require('../utils/utils');

// Think of using statics

const initialData = async (userId) => {
  try {
    // Users + lastMsg(+status+date+who) + conversation
    const user = await User.findById(userId).select('photo').lean();

    const conversations = await Conversation.find({ participants: userId })
      .select('participants type _id')
      .populate({
        path: 'participants',
        model: User,
        match: {
          _id: { $ne: userId },
        },
        select: ['_id', 'photo', 'username'],
      })
      .lean();

    // Collect the conversations Id
    const conversationIds = conversations.map((conv) => {
      return conv._id;
    });

    const Messages = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      // match the user who are in the same conversation
      { $match: { conversationId: { $in: conversationIds } } },
      {
        $group: {
          _id: '$conversationId',
          lastMsg: {
            $push: {
              senderId: '$senderId',
              content: '$content',
              contentType: '$contentType',
              status: '$status',
              createdAt: '$createdAt',
            },
          },
        },
      },
      { $limit: 10 },
    ]);

    // Last message
    const lastMessages = Messages.map((conversation) => ({
      _id: conversation._id,
      lastMsg: lastMsg(conversation.lastMsg, userId),
    }));

    // Combine the conversations with the last message send
    const res = conversations.map((conv) => {
      let messages = [];
      for (let last_msg of lastMessages) {
        // i don't know why exactly the lean return bson Type
        if (conv._id._id.toString() === last_msg._id.toString()) {
          console.log('PASS-2');
          messages.push(last_msg);
        }
      }
      return { ...conv, lastMsg: messages };
    });

    return { user, conversations: [...res] };
  } catch (err) {
    console.error(err);
  }
};

module.exports = initialData;

// TODO:
// - [x] Learn more about the relationship's in MongoDB
// - [x] whats the indexes use for
// - [x] Build the hole DB schema
// - [x] Build the validations for schema's
// - [x] Start building INITDATA class (think of what's exactly info we needed in the init )
// - [ ] Build login
// - [ ] Build automation script for import and init the Data(json ) auto and integrated in package.json
