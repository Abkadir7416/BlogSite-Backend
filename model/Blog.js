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
  // comments: {
  //   type: [String], // Array of strings
  //   default: [], // Default to an empty array
  // },

  comments: [
    {
      commentText: { type: String, required: true }, // The comment text
      // commentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to user who made the comment
    },
  ],
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
