const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  photo_url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const About = mongoose.model('About', aboutSchema);

module.exports = About;