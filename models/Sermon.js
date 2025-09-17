// const mongoose = require('mongoose');

// const sermonSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   author: { // కొత్త ఫీల్డ్
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   pdf_url: {
//     type: String,
//     required: true,
//   },
// }, { timestamps: true });

// const Sermon = mongoose.model('Sermon', sermonSchema);

// module.exports = Sermon;

// backend/models/Sermon.js
const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    pdf_url: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Sermon = mongoose.model('Sermon', sermonSchema);
module.exports = Sermon;
