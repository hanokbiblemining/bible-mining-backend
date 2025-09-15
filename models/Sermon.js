const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: { // కొత్త ఫీల్డ్
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pdf_url: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Sermon = mongoose.model('Sermon', sermonSchema);

module.exports = Sermon;