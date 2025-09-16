// const express = require('express');
// const router = express.Router();
// const Logo = require('../models/Logo');
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/logo/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// router.get('/', async (req, res) => {
//   try {
//     const logo = await Logo.findOne();
//     if (logo) {
//       res.json({ image_url: `http://localhost:5000/${logo.image_url}` });
//     } else {
//       res.json({});
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.post('/', upload.single('logo_image'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded.' });
//   }

//   try {
//     let logo = await Logo.findOne();
//     if (logo) {
//       logo.image_url = req.file.path;
//     } else {
//       logo = new Logo({ image_url: req.file.path });
//     }
//     const updatedLogo = await logo.save();
//     res.status(201).json(updatedLogo);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;

// routes/logo.js — Cloudinary image uploads for site logos (header/footer)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');   // Cloudinary config
const Logo = require('../models/Logo');               // మీ schema ఇదే అయితే OK

// memory storage (no disk)
const upload = multer({ storage: multer.memoryStorage() });

/* ===================== GET /api/logo ===================== */
/* Back-compat కోసం object రూపం కూడా ఇస్తున్నాం:
   {
     items: [...],
     types: ["header","footer",...],
     byType: { header: {...latest}, footer: {...latest}, ... }
   }
*/
router.get('/', async (req, res) => {
  try {
    const items = await Logo.find().sort({ createdAt: -1 });
    const types = await Logo.distinct('type');

    // ప్రతి type కి latest ఒకటి (createdAt desc లో మొదటిది)
    const byType = {};
    for (const t of types) {
      const latest = items.find(i => i.type === t);
      if (latest) byType[t] = latest;
    }

    res.json({ items, types, byType });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load logos' });
  }
});
/* ========================================================= */

/* ============== POST /api/logo — upload a logo ============== */
/* form fields:
   - image (file)  ← required (image/photo/file/upload ఏ పేరైనా కవరే)
   - type  (text)  ← "header" | "footer" | ఇతర పేర్లు, required
   - title (text)  ← optional
*/
router.post('/', upload.any(), async (req, res) => {
  try {
    // file: accept common field names
    const candidates = ['image', 'photo', 'picture', 'file', 'upload'];
    let file = req.file;
    if (!file && Array.isArray(req.files)) {
      file = req.files.find(f => candidates.includes(f.fieldname));
      if (!file && req.files.length > 0) file = req.files[0];
    }
    if (!file) return res.status(400).json({ message: "Logo file is required (field: image/photo/file)." });

    const type = String(req.body.type || '').trim().toLowerCase();
    if (!type) return res.status(400).json({ message: "Logo 'type' is required (e.g., header/footer)." });

    const folder = process.env.CLOUDINARY_FOLDER_LOGO || 'bible-mining/logo';

    // upload to Cloudinary (image)
    const result = await new Promise((resolve, reject) => {
      const up = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder },
        (err, r) => (err ? reject(err) : resolve(r))
      );
      streamifier.createReadStream(file.buffer).pipe(up);
    });

    const payload = {
      type,
      title: req.body.title || '',
      image_url: result.secure_url,
    };

    // Save as new version (history keep). UI latest ని show చేస్తుంది.
    const doc = new Logo(payload);
    const saved = await doc.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error('Add logo error:', err);
    res.status(400).json({ message: 'Logo upload failed', error: String(err) });
  }
});

module.exports = router;
