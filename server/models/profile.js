const mongoose = require('mongoose')
const {Schema} = mongoose

const profileSchema = new Schema({
    bio: String
})

const profileModel = mongoose.model('Profile', profileSchema);

module.exports = profileModel;