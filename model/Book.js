const mongoose = require('mongoose');

// Define the Review Schema
const reviewSchema = new mongoose.Schema({
  headline: {
    type: String,
    default:''
  },
  rating: {
    type: Number,
    default:0,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
    default:''
  },
  reviewedBy: {
    type: String,
    default:''
  },
  reviewDate: {
    type: Date
  },
});

// Define the Book Schema
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default:''
  },
  price: {
    type: Number,
    default:0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  language: {
    type: String,
    default:''
  },
  pages: {
    type: Number,
    default:0
  },
  seller: {
    type: String,
    default:''
  },
  publishingDate: {
    type: Date
  },
  publisher: {
    type: String,
    default:''
  },
  edition: {
    type: String,
    default:''
  },
  reviews: [reviewSchema], // Array of Review documents
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

// Create and export the Book model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
