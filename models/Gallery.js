const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;