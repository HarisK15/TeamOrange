const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cluckSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cluck", cluckSchema);
