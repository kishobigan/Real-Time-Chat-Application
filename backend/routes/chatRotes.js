const express = require('express')
const { sendMessage, getAllChat, get_all_message_for_chat } = require('../controllers/chatController')
const authenticateUser = require('../utils/tokenAuth')

const router = express.Router()


router.route('/sendMessage').post(sendMessage)
router.route('/get_all_chat').get(authenticateUser, getAllChat)
router.route('/get_all_messages').get(authenticateUser, get_all_message_for_chat)

module.exports =router