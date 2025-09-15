const express = require('express');
const router = express.Router();
const Logo = require('../models/Logo');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/logo/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const logo = await Logo.findOne();
    if (logo) {
      res.json({ image_url: `http://localhost:5000/${logo.image_url}` });
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('logo_image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    let logo = await Logo.findOne();
    if (logo) {
      logo.image_url = req.file.path;
    } else {
      logo = new Logo({ image_url: req.file.path });
    }
    const updatedLogo = await logo.save();
    res.status(201).json(updatedLogo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;