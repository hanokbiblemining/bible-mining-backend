const express = require('express');
const router = express.Router();
const About = require('../models/About');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/about/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// "నా గురించి" వివరాలను పొందడానికి
router.get('/', async (req, res) => {
  try {
    const aboutInfo = await About.findOne();
    if (aboutInfo) {
      res.json({ ...aboutInfo._doc, photo_url: `http://localhost:5000/${aboutInfo.photo_url}` });
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// "నా గురించి" వివరాలను అప్‌డేట్ చేయడానికి
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { description } = req.body;
    let aboutInfo = await About.findOne();
    const photo_url = req.file ? req.file.path : aboutInfo.photo_url;

    if (!aboutInfo) {
      aboutInfo = new About({ photo_url, description });
    } else {
      aboutInfo.photo_url = photo_url;
      aboutInfo.description = description;
    }
    const updatedAbout = await aboutInfo.save();
    res.status(201).json(updatedAbout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;