const mongoose = require('mongoose');

const studyToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Removes extra spaces
  },
  description: {
    type: String,
    default:''
  },
  type: {
    type: String,
    default:[],
    enum: ['Tool', 'Instrument', 'Gadget'] // Restrict to specific types
  },
  price: {
    type: Number,
    default:0,
    min: 0 // Ensures price is non-negative
  },
  brand: {
    type: String,
    default:''
  },
  model: {
    type: String,
    default:''
  },
  specifications: {
    type: [String], // Array of specifications
    default:[]
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  seller: {
    type: String,
    default:''
  },
  image: {
    type: String, // URL or file path
    default:''
  },
  availability: {
    type: Boolean,
    default: true
  },
  reviews: [
    {
      headline: { type: String, default:''},
      rating: { type: Number, default:0, min: 0, max: 5 },
      comment: { type: String },
      reviewedBy: { type: String, default:''},
      reviewDate: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create and export the model
const StudyTool = mongoose.model('StudyTool', studyToolSchema);

module.exports = StudyTool;
