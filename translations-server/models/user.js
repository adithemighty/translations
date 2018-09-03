const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    // required: true,
    unique: true
  },
  username: {
    type: String
    // required: true
  },
  password: {
    type: String
    // required: true
  },
  profileImageUrl: {
    type: String
  },
  role: {
    type: String,
    enum: ["Welfare officer", "Volunteer translator", "Professional translator"]
    // required: true
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
