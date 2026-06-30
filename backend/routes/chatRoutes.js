const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const { verifyToken } = require('../middleware/authMiddleware');

// HARUS di atas /:orderId agar tidak dianggap parameter
router.get('/list/all', verifyToken, ChatController.getChatList);
router.get('/:orderId', verifyToken, ChatController.getChats);
router.post('/', verifyToken, ChatController.sendMessage);

module.exports = router;