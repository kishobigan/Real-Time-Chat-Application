const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupChat', groupChatSchema);
