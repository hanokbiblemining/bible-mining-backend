const express = require('express');
const router = express.Router();
const Sermon = require('../models/Sermon');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/sermons/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// అన్ని ప్రసంగాలను, రచయితలను మరియు వర్గాలను పొందడానికి
router.get('/', async (req, res) => {
  try {
    const sermons = await Sermon.find();
    const authors = await Sermon.distinct('author'); // రచయితల జాబితాను పొందడం
    const categories = await Sermon.distinct('category');
    
    const sermonsWithFullUrl = sermons.map(sermon => ({
      ...sermon._doc,
      pdf_url: `http://localhost:5000/${sermon.pdf_url}`
    }));
    
    res.json({ sermons: sermonsWithFullUrl, authors: authors, categories: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// కొత్త ప్రసంగాన్ని జోడించడానికి
router.post('/', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  
  const sermon = new Sermon({
    title: req.body.title,
    author: req.body.author, // కొత్తగా రచయిత పేరును సేవ్ చేయడం
    category: req.body.category,
    description: req.body.description,
    pdf_url: req.file.path,
  });

  try {
    const newSermon = await sermon.save();
    res.status(201).json(newSermon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;