// user schema to define types of data we want to store in the user form
const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    userName : {
        type : String,
        unique : true,
        required : true,
    },
    email : {
        type : String,
        unique :true,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    bio : {
        type : String,
    },
    followers : [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    following : [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

