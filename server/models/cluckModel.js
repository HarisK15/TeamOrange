const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cluckSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Cluck', cluckSchema);
