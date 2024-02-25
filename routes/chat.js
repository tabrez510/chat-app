const express = require('express');
const router = express.Router();

const userAuthentication = require('../middlewares/auth');
const chatController = require('../controllers/chat');

router.post('/chat', userAuthentication.authenticate, chatController.createChat);

module.exports = router;