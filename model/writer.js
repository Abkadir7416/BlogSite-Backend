const mongoose = require("mongoose");

const writerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  degree: { 
    type: [String], // Array of strings
    default: []     // Default value: empty array
  },
  postCount: {
    type: Number,
    default:0
  },
  description: {
    type: String,
    default:"",
  },
  imgSrc: {
    type:String,
    default:'',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Writer", writerSchema);
