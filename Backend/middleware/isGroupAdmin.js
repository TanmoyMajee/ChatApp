const ChatModel = require('../models/chatModel');
const asyncHandler = require('express-async-handler');

const isGroupAdmin = asyncHandler(async (req, res, next) => {
  const GroupChatID = req.body.GroupchatID;
  const userID = req.user._id;
  // now first get the group chat by id then check if the user is admin or not
  var groupChat;
  try {
     groupChat = await ChatModel.findById(GroupChatID);
  if(!groupChat){
    res.status(404);
    throw new Error('Group chat not found');
  }
  } catch (error) {
    res.status(400);
    throw new Error('Group chat not found From catch');
  }
    if(!groupChat.groupAdmins.includes(userID)){
      res.status(403);
      throw new Error('You are not an admin of this group');
    }
    next();
      
});

module.exports = isGroupAdmin;