const socketIO = require('socket.io');
const Session = require('../models/Session');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const GroupChat = require('../models/GroupChat');
const { authenticateSocket } = require('../utils/socketMiddleware');

module.exports = (server) => {
    const io = socketIO(server);

    // Create a namespace for messages
    const messageNamespace = io.of('/messages');

    // Apply the authentication middleware to the namespace
    messageNamespace.use(authenticateSocket);

    // Handle connections to the /messages namespace
    messageNamespace.on('connection', (socket) => {
        console.log('User connected to /messages namespace:', socket.id);

        // Register user to associate their socket ID with their user ID
        socket.on('register_user', async ({ user_id }) => {
            try {
                await Session.findOneAndUpdate(
                    { user_id },
                    { socket_id: socket.id, updatedAt: Date.now() },
                    { upsert: true }
                );
                console.log(`User ${user_id} registered with socket ID: ${socket.id}`);
            } catch (err) {
                console.error('Error registering user:', err);
                socket.emit('error', { message: 'Failed to register user' });
            }
        });

        // Handle send_message event
        socket.on('send_message', async (data) => {
            const { chat_id, group_chat_id, sender_id, message } = data;

            try {
                // Save the message
                const newMessage = new Message({ chat_id, group_chat_id, sender_id, message });
                await newMessage.save();

                if (chat_id) {
                    // Handle private chat messages
                    const chat = await Chat.findById(chat_id);
                    const receiver_id = String(chat.user1_id) === sender_id ? chat.user2_id : chat.user1_id;

                    const session = await Session.findOne({ user_id: receiver_id });
                    if (session) {
                        messageNamespace.to(session.socket_id).emit('new_message', newMessage);
                    }
                } else if (group_chat_id) {
                    // Handle group chat messages
                    const groupChat = await GroupChat.findById(group_chat_id);
                    for (const user_id of groupChat.user_ids) {
                        if (String(user_id) !== sender_id) {
                            const session = await Session.findOne({ user_id });
                            if (session) {
                                messageNamespace.to(session.socket_id).emit('new_message', newMessage);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Error sending message:', err);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            console.log('User disconnected from /messages namespace:', socket.id);
            try {
                await Session.findOneAndUpdate({ socket_id: socket.id }, { $set: { socket_id: null } });
            } catch (err) {
                console.error('Error handling disconnect:', err);
            }
        });
    });
};
