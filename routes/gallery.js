// const express = require('express');
// const router = express.Router();
// const Gallery = require('../models/Gallery');
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/gallery/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// // అన్ని గ్యాలరీ డేటాను పొందడానికి
// router.get('/', async (req, res) => {
//   try {
//     const galleryItems = await Gallery.find();
//     const categories = await Gallery.distinct('category');
    
//     const itemsWithFullUrl = galleryItems.map(item => ({
//       ...item._doc,
//       image_url: `http://localhost:5000/${item.image_url}`
//     }));
    
//     res.json({ galleryItems: itemsWithFullUrl, categories });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // కొత్త ఫోటోను జోడించడానికి
// router.post('/', upload.single('photo'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded.' });
//   }
  
//   const galleryItem = new Gallery({
//     title: req.body.title,
//     category: req.body.category,
//     image_url: req.file.path,
//     description: req.body.description,
//   });

//   try {
//     const newGalleryItem = await galleryItem.save();
//     res.status(201).json(newGalleryItem);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;

// routes/gallery.js — Cloudinary image uploads (persistent)


// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const streamifier = require('streamifier');
// const cloudinary = require('../config/cloudinary'); // [PATCH]
// const Gallery = require('../models/Gallery');       // మీ మోడల్ పేరు ఇదే అయితే ok

// // [PATCH] Disk storage బదులు memoryStorage
// const upload = multer({ storage: multer.memoryStorage() });

// /* GET /api/gallery — అన్ని ఫోటోలు */
// router.get('/', async (req, res) => {
//   try {
//     // మీ స్కీమా లో order/createdAt ఉంటే ఇవే సరైనవి.
//     const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ message: err.message || 'Failed to load gallery' });
//   }
// });

// /* POST /api/gallery — కొత్త ఫోటో add (form field: "image") */
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "Image file is required (field 'image')." });

//     const folder = process.env.CLOUDINARY_FOLDER_GALLERY || 'bible-mining/gallery';

//     // Cloudinaryకి streamగా ఎక్కించడం
//     const result = await new Promise((resolve, reject) => {
//       const up = cloudinary.uploader.upload_stream(
//         { resource_type: 'image', folder }, // [PATCH] images కాబట్టి resource_type: 'image'
//         (err, r) => (err ? reject(err) : resolve(r))
//       );
//       streamifier.createReadStream(req.file.buffer).pipe(up);
//     });

//     // డైనమిక్ payload (మీ మోడల్ ఎలాంటి ఫీల్డ్స్ expect చేస్తే వాటిని తీసుకుంటాం)
//     const payload = {
//       image_url: result.secure_url,  // [PATCH] ముందెప్పటిలాగే image_url అనే ఫీల్డ్
//     };
//     // కామన్ టెక్స్ట్ ఫీల్డ్స్ ని optional గా జతచేయండి
//     ['title', 'caption', 'category', 'order', 'tags', 'alt'].forEach(f => {
//       if (req.body[f] != null && req.body[f] !== '') payload[f] = req.body[f];
//     });

//     const doc = new Gallery(payload);
//     const saved = await doc.save();

//     res.status(201).json(saved);
//   } catch (err) {
//     console.error('Add gallery error:', err);
//     res.status(400).json({ message: 'Gallery upload failed', error: String(err) });
//   }
// });

// module.exports = router;

// routes/gallery.js — Cloudinary image uploads (persistent)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');   // [PATCH] Cloudinary config
const Gallery = require('../models/Gallery');         // మీ schema ఇదే అయితే OK

// [PATCH] disk storage కాకుండా memory storage వాడుతున్నాం
const upload = multer({ storage: multer.memoryStorage() });

/* GET /api/gallery — అన్ని ఫోటోలు */
router.get('/', async (req, res) => {
  try {
    // మీ schema లో order/createdAt ఉంటే వీటి ప్రకారం సార్ట్ చేయొచ్చు
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to load gallery' });
  }
});

/* POST /api/gallery — కొత్త ఫోటో add (image/photo/file ఏ field అయినా) */
router.post('/', upload.any(), async (req, res) => {
  try {
    // [PATCH] ఏ పేరుతో వచ్చినా first image-like ఫైల్ ను తీసుకోండి
    const candidates = ['image', 'photo', 'picture', 'file', 'upload'];
    let file = req.file;
    if (!file && Array.isArray(req.files)) {
      file = req.files.find(f => candidates.includes(f.fieldname));
      // లేకపోతే మొదటి ఫైల్
      if (!file && req.files.length > 0) file = req.files[0];
    }
    if (!file) {
      return res.status(400).json({ message: "Image file is required (field: image/photo/file)." });
    }

    const folder = process.env.CLOUDINARY_FOLDER_GALLERY || 'bible-mining/gallery';

    // [PATCH] Cloudinaryకి streamగా ఎక్కించడం (images కాబట్టి resource_type: 'image')
    const result = await new Promise((resolve, reject) => {
      const up = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder },
        (err, r) => (err ? reject(err) : resolve(r))
      );
      streamifier.createReadStream(file.buffer).pipe(up);
    });

    // [PATCH] payload — మీ schema లో ఉన్న టెక్స్ట్ ఫీల్డ్స్ ని కూడా కలుపుకోండి
    const payload = {
      image_url: result.secure_url,       // ⚠️ Frontend ఈ ఫీల్డ్ ను చదవాలి
    };

    // Optional fields (schema లో ఉంటే సేవ్ అవుతాయి; strict అయితే ignore అవుతాయి)
    const textFields = ['title', 'caption', 'category', 'alt', 'tags', 'order'];
    textFields.forEach((f) => {
      if (req.body[f] != null && req.body[f] !== '') {
        payload[f] = f === 'order' ? Number(req.body[f]) : req.body[f];
      }
    });

    // [PATCH] Debug log (Render Logs లో చూడడానికి)
    console.log('[gallery:upload]', {
      fieldnames: (req.files || []).map(f => f.fieldname),
      savedUrl: payload.image_url,
      title: payload.title,
      category: payload.category,
      order: payload.order,
    });

    const doc = new Gallery(payload);
    const saved = await doc.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error('Add gallery error:', err);
    res.status(400).json({ message: 'Gallery upload failed', error: String(err) });
  }
});

module.exports = router;
