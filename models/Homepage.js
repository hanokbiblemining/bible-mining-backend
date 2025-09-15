const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Homepage = mongoose.model('Homepage', homepageSchema);

module.exports = Homepage;