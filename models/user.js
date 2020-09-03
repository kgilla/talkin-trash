const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const userSchema = new Schema({
  email: { type: String, required: true, min: 1, max: 60 },
  password: { type: String, required: true },
  firstName: { type: String, required: true, min: 1, max: 60 },
  lastName: { type: String, required: true, min: 1, max: 60 },
  dateJoined: { type: Date, default: new Date() },
  isMember: { type: Boolean, default: false },
});

userSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

userSchema.virtual("name").get(function () {
  return this.firstName + " " + this.lastName;
});

userSchema.virtual("niceDate").get(function () {
  return moment(this.date).format("MMMM Do, YYYY");
});

module.exports = mongoose.model("User", userSchema);
