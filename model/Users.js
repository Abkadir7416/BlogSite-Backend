const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Users", UserSchema);
