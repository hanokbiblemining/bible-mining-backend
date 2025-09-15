const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  youtube_link: {
    type: String,
  },
  facebook_link: {
    type: String,
  },
  instagram_link: {
    type: String,
  },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;