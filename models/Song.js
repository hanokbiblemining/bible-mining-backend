const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lyrics: {
    type: String,
    required: true,
  },
  audio_url: {
    type: String,
    required: true,
  },
  singer: {
    type: String,
    default: 'Unknown',
  },
  category: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);

module.exports = Song;