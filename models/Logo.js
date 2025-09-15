const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Logo = mongoose.model('Logo', logoSchema);

module.exports = Logo;