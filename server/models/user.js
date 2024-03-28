// user schema to define types of data we want to store in the user form
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  privacy: {
    type: Boolean,
    default: true,
  },
  blocked: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  verificationToken: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

