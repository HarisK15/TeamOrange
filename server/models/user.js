// user schema to define types of data we want to store in the user form
const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    userName : {
        type : String,
        unique : true,
    },
    email : {
        type : String,
        unique :true,
    },
    bio : {
        type : String,
    },
    
    password : String
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

