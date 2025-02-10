const express = require('express');
const router = express.Router();
const  protect  = require('../middleware/authMiddleware');
const { sendMessage, getAllMessages } = require('../controller/messageController');

router.post('/', protect,sendMessage);
router.get('/:chatId', protect, getAllMessages );

module.exports = router;