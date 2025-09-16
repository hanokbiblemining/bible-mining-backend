// const express = require('express');
// const router = express.Router();
// const Song = require('../models/Song');
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// // అన్ని పాటలను పొందడానికి
// router.get('/', async (req, res) => {
//   try {
//     const songs = await Song.find().sort({ order: 1, title: 1 }); // order ఆధారంగా సార్ట్ చేయడం
//     const singers = await Song.distinct('singer');
//     const songsWithFullUrl = songs.map(song => ({
//       ...song._doc,
//       audio_url: `http://localhost:5000/${song.audio_url}`
//     }));
//     res.json({ songs: songsWithFullUrl, singers: singers });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // కొత్త పాటను జోడించడానికి
// router.post('/', upload.single('audio'), async (req, res) => {
//   try {
//     const song = new Song({
//       title: req.body.title,
//       lyrics: req.body.lyrics,
//       audio_url: req.file.path,
//       singer: req.body.singer,
//       category: req.body.category,
//       order: req.body.order, // order నంబర్‌ను సేవ్ చేయడం
//     });
//     const newSong = await song.save();
//     res.status(201).json(newSong);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;

// routes/Songs.js
// --- Songs upload (multer) with absolute upload dir + public URL save ---

// const express = require('express');
// const router = express.Router();
// const Song = require('../models/Song');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs'); // [CHANGE] dirs create చేయడానికి

// /* ---------- [CHANGE] absolute uploads dir: uploads/songs ---------- */
// const SONGS_DIR = path.join(__dirname, '..', 'uploads', 'songs');
// try { fs.mkdirSync(SONGS_DIR, { recursive: true }); } catch {}

// /* ---------- [CHANGE] multer storage: absolute destination ---------- */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, SONGS_DIR); // absolute dir → Render లో ENOENT రాదు
//   },
//   filename: function (req, file, cb) {
//     cb(null, 'audio-' + Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });

// /* ---------- GET /api/songs ---------- */
// // అన్ని పాటలను పొందడం (order, title ఆధారంగా sort)
// // [CHANGE] audio_full_url ను convenience కోసం రిటర్న్ చేస్తున్నాం (optional)
// router.get('/', async (req, res) => {
//   try {
//     const songs = await Song.find().sort({ order: 1, title: 1 });
//     const singers = await Song.distinct('singer');

//     const base = `${req.protocol}://${req.get('host')}`; // e.g., https://bible-mining-backend-...onrender.com
//     const songsWithUrls = songs.map((s) => {
//       const obj = s.toObject();
//       const p = obj.audio_url || '';
//       // audio_url లో relative path ఉంటే పూర్తి URL కూడా ఇవ్వడం
//       obj.audio_full_url = p && p.startsWith('/') ? `${base}${p}` : p;
//       return obj;
//     });

//     res.json({ songs: songsWithUrls, singers });
//   } catch (err) {
//     res.status(500).json({ message: err.message || 'Failed to load songs' });
//   }
// });

// /* ---------- POST /api/songs ---------- */
// // [CHANGE] upload.single('audio') — frontend లో formData.append('audio', file) కి మ్యాచ్ అవుతుంది
// // DB లో audio_url ని **public URL** (/uploads/songs/<filename>) గా సేవ్ చేస్తున్నాం
// router.post('/', upload.single('audio'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "Audio file is required (field name: 'audio')." });
//     }

//     const publicAudioPath = `/uploads/songs/${req.file.filename}`; // [CHANGE] URL గా save

//     const song = new Song({
//       title: req.body.title,
//       lyrics: req.body.lyrics,
//       audio_url: publicAudioPath,
//       singer: req.body.singer,
//       category: req.body.category,
//       order: req.body.order,
//     });

//     const newSong = await song.save();
//     res.status(201).json(newSong);
//   } catch (err) {
//     console.error('Add song error:', err);
//     res.status(400).json({ message: 'Song upload failed', error: String(err) });
//   }
// });

// module.exports = router;

// routes/Songs.js — Cloudinary upload (persistent URLs)


// const express = require('express');
// const router = express.Router();
// const Song = require('../models/Song');
// const multer = require('multer');
// const cloudinary = require('../config/cloudinary');
// const streamifier = require('streamifier');

// // [PATCH] disk storage కాకుండా memory storage వాడుతున్నాం
// const upload = multer({ storage: multer.memoryStorage() });

// // GET: songs list
// router.get('/', async (req, res) => {
//   try {
//     const songs = await Song.find().sort({ order: 1, title: 1 });
//     const singers = await Song.distinct('singer');
//     res.json({ songs, singers });
//   } catch (err) {
//     res.status(500).json({ message: err.message || 'Failed to load songs' });
//   }
// });

// // POST: add song (form field name: 'audio')
// router.post('/', upload.single('audio'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "Audio file is required (field 'audio')." });

//     const folder = process.env.CLOUDINARY_FOLDER || 'bible-mining/songs';

//     // Cloudinaryకి stream‌గా అప్లోడ్ (mp3లకు resource_type:auto సేఫ్)
//     const result = await new Promise((resolve, reject) => {
//       const up = cloudinary.uploader.upload_stream(
//         { resource_type: 'auto', folder },
//         (err, r) => (err ? reject(err) : resolve(r))
//       );
//       streamifier.createReadStream(req.file.buffer).pipe(up);
//     });

//     const song = new Song({
//       title: req.body.title,
//       lyrics: req.body.lyrics,
//       audio_url: result.secure_url, // ← Cloudinary పూర్తి https URL
//       singer: req.body.singer,
//       category: req.body.category,
//       order: req.body.order,
//     });

//     const created = await song.save();
//     res.status(201).json(created);
//   } catch (err) {
//     console.error('Add song error:', err);
//     res.status(400).json({ message: 'Song upload failed', error: String(err) });
//   }
// });

// module.exports = router;

// routes/Songs.js — Cloudinary upload (persistent audio URLs)
const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// [PATCH] disk storage కాకుండా memory storage వాడుతున్నాం
const upload = multer({ storage: multer.memoryStorage() });

/* ======= GET: /api/songs ======= */
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ order: 1, title: 1 });
    const singers = await Song.distinct('singer');
    // Cloudinary URL ఇప్పటికే పూర్తి https URL — అలాగే రిటర్న్ చేస్తాం
    res.json({ songs, singers });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load songs' });
  }
});

/* ======= POST: /api/songs  (form field name: 'audio') ======= */
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required (field 'audio')." });
    }

    const folder = process.env.CLOUDINARY_FOLDER || 'bible-mining/songs';

    // Cloudinaryకి stream‌గా అప్లోడ్ (mp3లకు resource_type:auto సేఫ్)
    const result = await new Promise((resolve, reject) => {
      const up = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder },
        (err, r) => (err ? reject(err) : resolve(r))
      );
      streamifier.createReadStream(req.file.buffer).pipe(up);
    });

    // result.secure_url = permanent HTTPS URL
    const song = new Song({
      title: req.body.title,
      lyrics: req.body.lyrics,
      audio_url: result.secure_url,     // <— ప్లేయర్‌కు నేరుగా ఇదే src
      singer: req.body.singer,
      category: req.body.category,
      order: req.body.order,
    });

    const created = await song.save();
    res.status(201).json(created);
  } catch (err) {
    console.error('Add song error:', err);
    res.status(400).json({ message: 'Song upload failed', error: String(err) });
  }
});

module.exports = router;
