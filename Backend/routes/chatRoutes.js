const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const isGroupAdmin = require('../middleware/isGroupAdmin');
const { one_to_one_accessChatFun,getChats,createGroupChat,renameGroup ,addGroupUser, removeGroupUser, removeGroupUserFn} = require('../controller/chatController');


router.post('/CreateOneToOneChat',protect, one_to_one_accessChatFun); // this is the route will be to create a chat
router.get('/',protect, getChats); // this is the route to get all the chats
router.post('/CreateGroup',protect, createGroupChat); // this is the route to create a group chat
router.put('/groupRename', protect,isGroupAdmin,renameGroup); // this is the route to rename a group chat
 router.put('/removeGroupUser',protect,isGroupAdmin, removeGroupUserFn); // this is the route to remove a group chat
 router.put('/addGroupUser',protect,isGroupAdmin, addGroupUser); // this is the route to add a user to a group

module.exports = router;