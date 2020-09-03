const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const postSchema = new Schema({
  date: { type: Date, default: new Date() },
  updated: { type: Date, default: "" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true, min: 1, max: 60 },
  content: { type: String, required: true, min: 1, max: 180 },
});

postSchema.virtual("url").get(function () {
  return "/posts/" + this._id;
});

postSchema.virtual("niceDate").get(function () {
  return moment(this.date).format("MMMM Do, YYYY");
});

postSchema.virtual("niceUpdated").get(function () {
  return moment(this.updated).format("MMMM Do, YYYY");
});

module.exports = mongoose.model("Post", postSchema);
