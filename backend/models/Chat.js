const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
