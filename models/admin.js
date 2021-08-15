const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  username: String,
  password: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
