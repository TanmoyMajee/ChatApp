const MessageModel = require('../models/messageModel');
const ChatModel = require('../models/chatModel');
const UserModel = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const sendMessage = asyncHandler(async (req, res) => {
  // get the chat id from the request body
  const { chatId,content } = req.body;
  if (!chatId || !content ){
    res.status(400);
    throw new Error('Chat ID and content is required');
  }
  try {
    var newMessage = await MessageModel.create({
      sender: req.user._id,
      content,
      chat: chatId
    });
    if(!newMessage){
      res.status(400);
      throw new Error('Message sending failed From if block');
    }else{
      // update the latest message in the chat model
      var chat = await ChatModel.findById(chatId);
       if (!chat) {
      res.status(404);
      throw new Error('Chat not found in the database');
    }
      chat.latestMessage = newMessage._id;
      await chat.save(); // as we are updating the chat model so we need to save it
      // before sending the response we need to populate the sender details
      // const fullMessage = await UserModel.populate(newMessage, {
      //   path: 'sender',
      //   select: '-password'
      // });
      newMessage = await newMessage.populate('sender', '-password');
      newMessage = await newMessage.populate('chat');
      // now populate the chat details
      newMessage = await UserModel.populate(newMessage, {
        path : 'chat.users',
        select: '-password'
      });
      res.status(201).send(newMessage);
    }
  } catch (error) {
    res.status(400);
    throw new Error('Message sending failed' + error);
  }

});

const getAllMessages = asyncHandler(async (req, res) => { 
    const  {chatId } = req.params;
    if (!chatId){
      res.status(400);
      throw new Error('Chat ID is required');
    }
    // chek if the person is part of the chat
    try {
      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        res.status(404);
        throw new Error('Chat not found in the database');
      }
      if(!chat.users.includes(req.user._id)){
        res.status(400);
        throw new Error('You are not part of this chat');
      }
      const alllMessages = await MessageModel.find({chat: chatId})
      .populate('sender','-password')
      .populate('chat'); 
      if(!alllMessages){
        res.status(400);
        throw new Error('Message fetching failed from if block');
    }
    
    res.status(200).send(alllMessages); 
  }catch (error) {
      res.status(400);
      throw new Error('Message fetching failed' + error);
    }
});

module.exports = { sendMessage, getAllMessages };