const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['error', 'success', 'info'],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;