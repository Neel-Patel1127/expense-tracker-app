const mongoose = require("mongoose");

// This defines what a "User" looks like in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // name is mandatory
  },
  email: {
    type: String,
    required: true,
    unique: true, // no two users can have same email
  },
  password: {
    type: String,
    required: true,
    // NOTE: We are storing plain password for simplicity (college MVP only)
    // In real projects, always hash passwords
  },
});

module.exports = mongoose.model("User", userSchema);
