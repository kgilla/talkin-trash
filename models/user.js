const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, min: 1, max: 60 },
  password: { type: String, required: true },
  firstName: { type: String, required: true, min: 1, max: 60 },
  lastName: { type: String, required: true, min: 1, max: 60 },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

module.exports = mongoose.model("User", UserSchema);
