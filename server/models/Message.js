const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    fullName: String,
    number: String,
    description: String,
    unread: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;