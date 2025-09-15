const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// అన్ని పాటలను పొందడానికి
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ order: 1, title: 1 }); // order ఆధారంగా సార్ట్ చేయడం
    const singers = await Song.distinct('singer');
    const songsWithFullUrl = songs.map(song => ({
      ...song._doc,
      audio_url: `http://localhost:5000/${song.audio_url}`
    }));
    res.json({ songs: songsWithFullUrl, singers: singers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// కొత్త పాటను జోడించడానికి
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const song = new Song({
      title: req.body.title,
      lyrics: req.body.lyrics,
      audio_url: req.file.path,
      singer: req.body.singer,
      category: req.body.category,
      order: req.body.order, // order నంబర్‌ను సేవ్ చేయడం
    });
    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;