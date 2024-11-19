const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true }, // Link to the Blog's ID
  commentText: { type: String, required: true }, // The text of the comment
  commentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  }, // ID of the user who commented
  createdAt: { type: Date, default: Date.now }, // Timestamp for the comment
});

module.exports = mongoose.model("Comment", CommentSchema);
