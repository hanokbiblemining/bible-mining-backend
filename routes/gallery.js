const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/gallery/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// అన్ని గ్యాలరీ డేటాను పొందడానికి
router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    const categories = await Gallery.distinct('category');
    
    const itemsWithFullUrl = galleryItems.map(item => ({
      ...item._doc,
      image_url: `http://localhost:5000/${item.image_url}`
    }));
    
    res.json({ galleryItems: itemsWithFullUrl, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// కొత్త ఫోటోను జోడించడానికి
router.post('/', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  
  const galleryItem = new Gallery({
    title: req.body.title,
    category: req.body.category,
    image_url: req.file.path,
    description: req.body.description,
  });

  try {
    const newGalleryItem = await galleryItem.save();
    res.status(201).json(newGalleryItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;