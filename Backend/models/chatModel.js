const mongoose = require('mongoose');
const chatModel = mongoose.Schema({
  chatName:{
    type: String,
    trim: true
  },
  groupChat: {
    type: Boolean,
    default: false
  },
  users:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatUser'
  }],
  latestMessage:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage'
  },
  groupAdmins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatUser'
  }],
   GroupImage: {
    type: String,
     default: 'https://up.yimg.com/ib/th?id=OIP.TOPp5xCWxCUYo6PoL9V31QHaFC&pid=Api&rs=1&c=1&qlt=95&w=148&h=101'
  },
},{timestamps: true});

const ChatModel = mongoose.model('Chat', chatModel);
module.exports = ChatModel;


// The Chat model has the following schema: and the stored data will look like this:
// here i am sending the msg to ram and the chat is a group chat
// if its a one to one chat then the gropuChat will be false and the users will be only 2
// and the gropuAdmins will be empty
// 

// *********** chat name is customed by the front end developer as for me chat name will be ram as i am sending data to ram ***********
//   "_id": "chat123",
//   "chatName": "Study Group",
//   "isGroupChat": true,
//   "users": ["tanmoy_id", "ram_id"],  // User IDs for you and Ram
//   "groupAdmins": ["tanmoy_id", "ram_id"],  // Both you and Ram are admins
//   "latestMessage": "msg456",  // ID of the latest message (optional)
//   "createdAt": "2025-02-02T08:00:00Z",
//   "updatedAt": "2025-02-02T08:05:00Z"
// }