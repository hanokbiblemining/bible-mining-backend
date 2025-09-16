// config/cloudinary.js

// Cloudinary SDK యొక్క v2 API వాడుతున్నాం
const cloudinary = require('cloudinary').v2;

// Credentials ని ఎప్పుడూ కోడ్‌లో హార్డ్‌కోడ్ చేయకండి!
// Render (లేదా .env) లోని ENV variables ద్వారానే లోడ్ అవుతాయి.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ఇతర ఫైళ్లలో వాడుకోవడానికి export
module.exports = cloudinary;
