const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, min: 1, max: 60 },
  content: { type: String, required: true, min: 1, max: 180 },
});

module.exports = mongoose.model("Post", PostSchema);
