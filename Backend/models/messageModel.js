const mongoose = require('mongoose');
// const ChatModel = require('./chatModel');
// const UserModel = require('./userModel');
// mesggage model has 3 schema
// sender : user id [ whcih user send the message]
// content : message content
// chat : chat id [ which chat the message belongs to]

const msgModel = mongoose.Schema({
  sender :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content:{
    type: String,
    trim: true
  },
  chat:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
},{timestamps: true});

const MessageModel = mongoose.model('Message', msgModel);
module.exports = MessageModel;

// message model has the following schema:
// here we didnt require the receiver as we can track the receiver from the chat model _id
// as each msg belongs to a chat 

// [
//   {
//     "_id": "msg001",
//     "sender": "tanmoy_id",  // Sender is you
//     "content": "Hello, everyone!",  // Message content
//     "chat": "chat123",  // Reference to the chat (Study Group)
//     "createdAt": "2025-02-02T08:00:10Z",
//     "updatedAt": "2025-02-02T08:00:10Z"
//   },
//   {
//     "_id": "msg002",
//     "sender": "ram_id",  // Sender is Ram
//     "content": "Hey Tanmoy, what's up?",  // Message content
//     "chat": "chat123",  // Reference to the same chat (Study Group)
//     "createdAt": "2025-02-02T08:02:00Z",
//     "updatedAt": "2025-02-02T08:02:00Z"
//   }
// ]