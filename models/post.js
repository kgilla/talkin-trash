const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const PostSchema = new Schema({
  date: { type: Date, default: Date.now() },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, min: 1, max: 60 },
  content: { type: String, required: true, min: 1, max: 180 },
});

PostSchema.virtual("url").get(function () {
  return "/post/" + this._id;
});

PostSchema.virtual("niceDate").get(function () {
  return moment(this.date).format("MMMM Do, YYYY");
});

module.exports = mongoose.model("Post", PostSchema);
