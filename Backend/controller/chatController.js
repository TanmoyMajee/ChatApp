const asyncHandler = require('express-async-handler');
const ChatModel = require('../models/chatModel');
const UserModel = require('../models/userModel');

const one_to_one_accessChatFun = asyncHandler(async (req, res) => {
      const {receiverID } = req.body;
      console.log(req.body)
      if(!receiverID ){
        res.status(400);
        throw new Error('Receiver id is required');
      }
      // now find the chat between the user and the receiver is already created or not
      // by checking the users array in the chat , as this array will have only 2 users
      // one is curr user and the receiver
      // req.user._id is the current user id which is gettig from the protect middleware
      //  and we are getting the receiver id from the 
      // in ischat we are geting both the user details and the latest message details
      // but to know the sender details of the latest message we need to populate the latest message again
      var ischat = await ChatModel.findOne({ 
        // here we are cheking if ther exists a one o one chat betwn both of then 
        // then no need to crate a new chat
        users: { $all: [req.user._id, receiverID] },
         groupChat: false
      }).populate('users','-password').populate('latestMessage');

      //  here as the latest message is a message model so we need to populate the latest message again to get the sender details of the latest message
      ischat=await UserModel.populate(ischat, { 
        path: 'latestMessage.sender',
        select: '-password'});

       if(ischat ){
        // res.status(200).send(ischat[0]);
         res.status(200).send(ischat);
       }else{
        // create a chat between the user and the receiver
        try{
          const chat = await ChatModel.create({
            chatName: "One O one ",
            users: [req.user._id, receiverID],
            latestMessage: null,
            groupChat: false,
            groupAdmins: []
          })
          // this fucllchat is still confusing 
          const fullChat = await ChatModel.findById(chat._id).populate('users','-password').populate('latestMessage');
          res.status(201).send(fullChat);
       }catch(error){
        console.log("Error while creating chat ",error)
        res.status(400);
        throw new Error('Chat creation failed');
       }
      }
        
});

const getChats = asyncHandler(async (req, res) => {
   try {
      var allChat = await  ChatModel.find({ users: req.user._id })
     .populate('users','-password')
     .populate('groupAdmins','-password')
     .populate('latestMessage')
     .sort({ updatedAt: -1 });  // sort the chat by the latest updated chat  fgg
    //  now again populate the latest message to get the sender details of the latest message
    //  as the latest message is a message model so we need to populate the latest message again to get the sender details of the latest message
    allChat = await UserModel.populate(allChat, { 
        path: 'latestMessage.sender',
        select: '-password'  
    })
     res.send(allChat);
   } catch (error) {
      res.status(400);
      throw new Error('Failed to get All the chats');
   }
});


const createGroupChat= asyncHandler(async (req, res) => {
  // user have to send two thing one is the gropu name and the users array
  if(!req.body.users || !req.body.chatName){
    res.status(400);
    throw new Error('All fields are required To form a group chat');
  }
  if(req.body.users.length < 2){
    res.status(400);
    throw new Error('Group chat must have atleast 2 users');
  }
  // add me to the group chat
  req.body.users.push(req.user._id);
  try {
    const chat = await ChatModel.create({
      chatName: req.body.chatName,
      users: req.body.users,
      latestMessage: null,
      groupChat: true,
      groupAdmins: [req.user._id]
    })
    // 
    const chatINFO = await ChatModel.findById(chat._id).populate('users','-password').
    populate('groupAdmins','-password')
    .populate('latestMessage');
    res.status(201).send(chatINFO);
} catch (error) {
    res.status(400);
    throw new Error('Chat creation failed');
}
});


const renameGroup = asyncHandler(async (req, res) => {
  // only admins can rename the group ,
    // forntend will send the chat id of the group and the new name of the group
    if(!req.body.GroupchatID || !req.body.newGropuName){
      res.status(400);
      throw new Error('Chat ID and new name are required');
    }
    // // first find the grop
    // const groupchat = await ChatModel.findById(req.body.GroupchatID);
    // if(!groupchat){
    //   res.status(400);
    //   throw new Error('No Group chat found');
    // }
    // now find the user is the admin of the group or not
    // as groupAdmins is an array so we can use the includes method to check the user is the admin of the group or not
    //   if (!groupchat.groupAdmins.includes(req.user._id)) {
    // res.status(403);
    // throw new Error('You are not an admin of this group');
  // }
    try {
      const UpdatedChat = await ChatModel.findByIdAndUpdate(req.body.GroupchatID, { chatName: req.body.newGropuName }, { new: true }) .populate('users','-password').populate('groupAdmins','-password').populate('latestMessage');
      // In Mongoose, the new: true option is used in methods like findByIdAndUpdate, findOneAndUpdate, and updateOne to return the modified document rather than the original document. By default, these methods return the original document before the update was applied.
      if(!UpdatedChat){
        res.status(400);
        throw new Error('No Group chat found');
      }
      res.status(201).send(UpdatedChat);
        
    } catch (error) {
      res.status(400);
      throw new Error('Failed to rename the chat');
    }
});

const addGroupUser = asyncHandler(async (req, res) => {
  // here user will send the grop chat id and the user id to add to the group
    if(!req.body.GroupchatID || !req.body.newGroupUsers){
      res.status(400);
      throw new Error('Chat ID and new name are required');
    }
    // first find the grop
  // now add the user to the group
  try {
      const updatedChat = await ChatModel.findByIdAndUpdate(req.body.GroupchatID, { $push: { users: req.body.newGroupUsers } }, { new: true }).populate('users','-password').populate('groupAdmins','-password').populate('latestMessage');

      if(!updatedChat){
        res.status(400);
        throw new Error('No Group chat found');
      }else{
        res.status(201).send(updatedChat);
      }

  } catch (error) {
    res.status(400);
    throw new Error('Failed to add the user to the group');
  }
});

const removeGroupUserFn = asyncHandler(async (req, res) => {
  // here user will send the grop chat id and the user id to add to the group
    if(!req.body.GroupchatID || !req.body.removeGroupUsers){
      res.status(400);
      throw new Error('Chat ID and new name are required');
    }
  // now add the user to the group
  try {
      const updatedChat = await ChatModel.findByIdAndUpdate(req.body.GroupchatID,
         { $pull: { users: { $in: req.body.removeGroupUsers} } }, { new: true }).populate('users','-password').populate('groupAdmins','-password').populate('latestMessage');

      if(!updatedChat){
        res.status(400);
        throw new Error('No Group chat found');
      }else{
        res.status(201).send(updatedChat);
      }

  } catch (error) {
    res.status(400);
    throw new Error('Failed to remove the user to the group');
  }
});

const leaveGroupFn = asyncHandler(async (req,res)=>{
    const {chatId} = req.body;
    if(!chatId){
       res.status(400);
      throw new Error('Chat ID is required');
    }
    console.log(chatId)
    // now find the chat in which he is present , then pull him form the user array
    try {
       const UpdatedChat = await ChatModel.findByIdAndUpdate(
        chatId,{$pull : { users: req.user._id }} , {new : true}).populate('users','-password').populate('groupAdmins','-password').populate('latestMessage');

         if(!UpdatedChat){
          // now send the updatad caht list no the caht itsel
        res.status(400);
        throw new Error('No Group chat found');
      }else{
              // console.log("User is leaves form this gorop", UpdatedChat)
              // send the deleted chat object again , 
              // forntedn map on the previoius chat list and remokve this chat so the chat list will be updated
  
        res.status(201).send(UpdatedChat);
      }
    } catch (error) {
      res.status(400);
      console.log("Error while remove group  ",error)
    throw new Error('Failed to remove the user to the group');
    }

})

module.exports = { one_to_one_accessChatFun , getChats,createGroupChat,renameGroup,addGroupUser,removeGroupUserFn , leaveGroupFn };


//  why we cant directly use the receiver id to get the lastChat msg user 
// In a one-to-one chat:

// Both users (you and the receiver) can be the sender of the latest message.
// The latestMessage field in the Chat model stores the most recent message.
// It includes the content of the message and a reference to the sender (sender field), which stores the user ID of the person who sent the message.
// When you fetch a one-to-one chat:

// Either you or the receiver can be the sender of the latest message.
// The sender field in the latestMessage object will contain the sender's details (e.g., _id, name, email).