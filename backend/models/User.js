const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilePicture: {type: String},
    status: {type: String, enum: ['online', 'offline'], default: 'offline'},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('User', userSchema)