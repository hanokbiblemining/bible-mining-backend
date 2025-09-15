const express = require('express');
const router = express.Router();
const Homepage = require('../models/Homepage');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/homepage/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// బ్యాక్‌గ్రౌండ్ ఇమేజ్‌ను పొందడానికి
router.get('/', async (req, res) => {
  try {
    const homepage = await Homepage.findOne();
    if (homepage) {
      res.json({ image_url: `http://localhost:5000/${homepage.image_url}` });
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// బ్యాక్‌గ్రౌండ్ ఇమేజ్‌ను అప్‌లోడ్ చేయడానికి/అప్‌డేట్ చేయడానికి
router.post('/', upload.single('background_image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    let homepage = await Homepage.findOne();
    if (homepage) {
      homepage.image_url = req.file.path;
    } else {
      homepage = new Homepage({ image_url: req.file.path });
    }
    const updatedHomepage = await homepage.save();
    res.status(201).json(updatedHomepage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;