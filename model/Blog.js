const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  writer: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imgSrc: {
    type: String,
  },
  summary: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  commentCount: {
    type: String, // Array of strings
    default: 0, // Default to an empty array
  },
  comments: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment" 
    }
  ], // References comments
  saved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
