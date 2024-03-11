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
    recluckUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recluck: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cluck", cluckSchema);
