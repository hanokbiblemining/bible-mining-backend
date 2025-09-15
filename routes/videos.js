const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// Get all videos, authors, and categories
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    const authors = await Video.distinct('author');
    const categories = await Video.distinct('category');
    
    res.json({ videos, authors, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new video
router.post('/', async (req, res) => {
  const newVideo = new Video({
    title: req.body.title,
    author: req.body.author,
    category: req.body.category,
    youtube_url: req.body.youtube_url,
    description: req.body.description,
  });

  try {
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;