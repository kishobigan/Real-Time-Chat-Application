const express = require('express');
const router = express.Router();
const { io } = require('socket.io-client');

router.post('/testSocket', async (req, res) => {
    const { serverUrl, sender_id, chat_id, message, isGroup, group_chat_id } = req.body;

    try {
        const socket = io(serverUrl, {
            reconnectionDelay: 1000,
            reconnectionAttempts: 3,
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit('send_message', {
                sender_id,
                chat_id: isGroup ? null : chat_id,
                message,
                group_chat_id: isGroup ? group_chat_id : null,
            });
        });

        socket.on('new_message', (data) => {
            console.log('Message received:', data);
        });

        socket.on('error', (error) => {
            console.error('Error:', error);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        res.status(200).json({ success: true, message: 'Socket test triggered' });
    } catch (error) {
        console.error('TestSocket Error:', error);
        res.status(500).json({ success: false, message: 'Socket test failed', error });
    }
});

module.exports = router;
