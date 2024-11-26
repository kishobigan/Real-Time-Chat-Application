const Message = require('../models/Message');
const Chat = require('../models/Chat');
const GroupChat = require('../models/GroupChat');
const User = require('../models/User')
const mongoose = require('mongoose');

exports.sendMessage = async (req, res) => {
    const { sender_id, receiver_id, message, group_chat_id, isGroup } = req.body;

    try {
        let chat_id;

        if (!isGroup) {
            // For one-to-one chat
            let chat = await Chat.findOne({
                $or: [
                    { user1_id: sender_id, user2_id: receiver_id },
                    { user1_id: receiver_id, user2_id: sender_id },
                ],
            });

            if (!chat) {
                // Create a new chat if not exists
                chat = new Chat({
                    user1_id: sender_id,
                    user2_id: receiver_id,
                    messages: [],
                });
                await chat.save();
            }
            chat_id = chat._id;
        } else {
            // For group chat
            let groupChat = await GroupChat.findById(group_chat_id);

            if (!groupChat) {
                return res.status(400).json({ success: false, message: 'Group chat not found' });
            }
        }

        // Create a new message
        const newMessage = new Message({
            chat_id: isGroup ? null : chat_id,
            group_chat_id: isGroup ? group_chat_id : null,
            sender_id,
            message,
        });
        await newMessage.save();

        // Update the corresponding chat or group chat
        if (!isGroup) {
            await Chat.findByIdAndUpdate(chat_id, {
                $push: { messages: newMessage._id },
                updatedAt: Date.now(),
            });
        } else {
            await GroupChat.findByIdAndUpdate(group_chat_id, {
                $push: { messages: newMessage._id },
                updatedAt: Date.now(),
            });
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage,
        });
    } catch (error) {
        console.error('Error in sending message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};


exports.getAllChat = async (req, res) => {
    const userId = req.user.id;

    try {
        let chats = await Chat.find({
            $or: [
                { user1_id: userId },
                { user2_id: userId }
            ]
        }).populate('messages');

        let chatDetails = await Promise.all(
            chats.map(async (chat) => {
                const opponentId = chat.user1_id === userId ? chat.user2_id : chat.user1_id;

                const opponent = await User.findById(opponentId).select('name profilePic');

                const lastMessage = chat.messages[chat.messages.length - 1];

                return {
                    chatId: chat._id,
                    opponent: {
                        id: opponentId,
                        name: opponent.name,
                        profilePic: opponent.profilePic,
                    },
                    lastMessage: lastMessage ? {
                        text: lastMessage.message,
                        sender: lastMessage.sender_id,
                        timestamp: lastMessage.timestamp,
                        isRead: lastMessage.isRead
                    } : null,
                    updatedAt: lastMessage ? lastMessage.createdAt : chat.updatedAt,
                };
            })
        );

        chatDetails.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        res.status(200).json(chatDetails);

    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
            error: err.message,
        });
    }
};


exports.get_all_message_for_chat = async (req, res) => {
    const user = req.user

    const chat_id = req.query.chat_id

    if(!chat_id){
        res.status(400).json({
            status : 'failed',
            message: 'there is no chat_id'
        })
    }

    let chats = await Message.find({
        chat_id : chat_id
    })

    res.status(200).json(chats)
}