const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chat_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
    group_chat_id: {type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat'},
    sender_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    message: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    read_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    isRead: {type: Boolean, default: false}
});

module.exports = mongoose.model('Message', messageSchema);