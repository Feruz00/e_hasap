const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
    },
    photo:{
        type:String,
        default: ''
    },
    fullName: {
        type:String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
},{timestamps: true});

userSchema.plugin(passportLocalMongoose,{ usernameField: 'username'});

const User = mongoose.model('User',userSchema);

module.exports = User;