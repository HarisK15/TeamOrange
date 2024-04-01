const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cluckSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recluckUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    recluck: {
      type: Boolean,
    },
    likedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [{ type: Schema.Types.ObjectId, ref: 'Cluck' }],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Cluck',
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cluck', cluckSchema);
