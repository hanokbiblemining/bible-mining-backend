// // const express = require('express');
// // const router = express.Router();
// // const Sermon = require('../models/Sermon');
// // const multer = require('multer');
// // const path = require('path');

// // const storage = multer.diskStorage({
// //   destination: function(req, file, cb) {
// //     cb(null, 'uploads/sermons/');
// //   },
// //   filename: function(req, file, cb) {
// //     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
// //   }
// // });

// // const upload = multer({ storage: storage });

// // // అన్ని ప్రసంగాలను, రచయితలను మరియు వర్గాలను పొందడానికి
// // router.get('/', async (req, res) => {
// //   try {
// //     const sermons = await Sermon.find();
// //     const authors = await Sermon.distinct('author'); // రచయితల జాబితాను పొందడం
// //     const categories = await Sermon.distinct('category');
    
// //     const sermonsWithFullUrl = sermons.map(sermon => ({
// //       ...sermon._doc,
// //       pdf_url: `http://localhost:5000/${sermon.pdf_url}`
// //     }));
    
// //     res.json({ sermons: sermonsWithFullUrl, authors: authors, categories: categories });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // కొత్త ప్రసంగాన్ని జోడించడానికి
// // router.post('/', upload.single('pdf'), async (req, res) => {
// //   if (!req.file) {
// //     return res.status(400).json({ message: 'No file uploaded.' });
// //   }
  
// //   const sermon = new Sermon({
// //     title: req.body.title,
// //     author: req.body.author, // కొత్తగా రచయిత పేరును సేవ్ చేయడం
// //     category: req.body.category,
// //     description: req.body.description,
// //     pdf_url: req.file.path,
// //   });

// //   try {
// //     const newSermon = await sermon.save();
// //     res.status(201).json(newSermon);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // });

// // module.exports = router;

// // routes/sermons.js
// // const express = require('express');
// // const router = express.Router();
// // const Sermon = require('../models/Sermon');

// // const multer = require('multer');
// // const streamifier = require('streamifier');
// // const cloudinary = require('../config/cloudinary'); // <-- same config used by songs
// // // NOTE: diskStorage బదులు memoryStorage వాడుతున్నాం (Renderలో disk path issues నివారించడానికి)
// // const upload = multer({ storage: multer.memoryStorage() });

// // /* =================== GET: /api/sermons =================== */
// // router.get('/', async (req, res) => {
// //   try {
// //     const sermons = await Sermon.find().sort({ title: 1 });

// //     // pdf_url ఇప్పటికే Cloudinary HTTPS అయితే 그대로 రిటర్న్ చేస్తాం.
// //     // ఏదైనా relative path ఉన్న వాటికోసం (పాత డేటా) absolute URL గా మార్చుతాం.
// //     const base = `${req.protocol}://${req.get('host')}/`;
// //     const sermonsWithFullUrl = sermons.map(s => {
// //       const url = s.pdf_url || '';
// //       const isHttp = /^https?:\/\//i.test(url);
// //       return {
// //         ...s._doc,
// //         pdf_url: isHttp ? url : (url ? new URL(url, base).toString() : ''),
// //       };
// //     });

// //     const authors = await Sermon.distinct('author');
// //     const categories = await Sermon.distinct('category');

// //     res.json({ sermons: sermonsWithFullUrl, authors, categories });
// //   } catch (err) {
// //     console.error('Get sermons error:', err);
// //     res.status(500).json({ message: err.message || 'Failed to load sermons' });
// //   }
// // });

// // /* =================== POST: /api/sermons ===================
// //    Frontend form field name must be 'pdf'
// //    Cloudinaryకి PDFs ను RAWగా upload చేస్తాం.
// // ============================================================= */
// // router.post('/', upload.single('pdf'), async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "PDF file is required (field 'pdf')." });
// //     }

// //     // Folder: env > fallback
// //     const folder =
// //       process.env.CLOUDINARY_FOLDER_SERMONS ||
// //       process.env.CLOUDINARY_SERMONS_FOLDER || // in case you used this name before
// //       'bible-mining/sermons';

// //     // RAW upload for PDFs (format: pdf). 'auto' కూడా పని చేస్తుంది, కానీ RAW safest.
// //     const result = await new Promise((resolve, reject) => {
// //       const up = cloudinary.uploader.upload_stream(
// //         { resource_type: 'raw', folder, format: 'pdf' },
// //         (err, r) => (err ? reject(err) : resolve(r))
// //       );
// //       streamifier.createReadStream(req.file.buffer).pipe(up);
// //     });

// //     const sermon = new Sermon({
// //       title: req.body.title,
// //       author: req.body.author,
// //       category: req.body.category,
// //       description: req.body.description,
// //       pdf_url: result.secure_url, // permanent HTTPS Cloudinary URL
// //     });

// //     const created = await sermon.save();
// //     res.status(201).json(created);
// //   } catch (err) {
// //     console.error('Add sermon error:', err);
// //     res.status(400).json({ message: 'Sermon upload failed', error: String(err) });
// //   }
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Sermon = require('../models/Sermon');

// const multer = require('multer');
// const streamifier = require('streamifier');
// const cloudinary = require('../config/cloudinary'); // songsలాగే config
// const upload = multer({ storage: multer.memoryStorage() });

// /* =================== GET: /api/sermons =================== */
// router.get('/', async (req, res) => {
//   try {
//     const sermons = await Sermon.find().sort({ title: 1 });
//     const authors = await Sermon.distinct('author');
//     const categories = await Sermon.distinct('category');

//     // absolute అయితే అలాగే ఉంచు; relative అయితే మాత్రమే base జోడించు
//     const base = `${req.protocol}://${req.get('host')}/`;
//     const sermonsWithFullUrl = sermons.map((s) => {
//       const url = s.pdf_url || '';
//       const isAbsolute = /^https?:\/\//i.test(url);
//       return {
//         ...s._doc,
//         pdf_url: isAbsolute ? url : (url ? new URL(url, base).toString() : ''),
//       };
//     });

//     res.json({ sermons: sermonsWithFullUrl, authors, categories });
//   } catch (err) {
//     console.error('Get sermons error:', err);
//     res.status(500).json({ message: err.message || 'Failed to load sermons' });
//   }
// });

// /* =================== POST: /api/sermons ===================
//    form field name: 'pdf' (frontend: form.append('pdf', file))
//    Cloudinaryకి RAW PDF గా upload.
// ============================================================= */
// router.post('/', upload.single('pdf'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "PDF file is required (field 'pdf')." });
//     }

//     const folder =
//       process.env.CLOUDINARY_FOLDER_SERMONS ||
//       process.env.CLOUDINARY_SERMONS_FOLDER ||
//       'bible-mining/sermons';

//     const result = await new Promise((resolve, reject) => {
//       const up = cloudinary.uploader.upload_stream(
//         { resource_type: 'raw', folder, format: 'pdf' },
//         (err, r) => (err ? reject(err) : resolve(r))
//       );
//       streamifier.createReadStream(req.file.buffer).pipe(up);
//     });

//     const sermon = new Sermon({
//       title: req.body.title,
//       author: req.body.author,
//       category: req.body.category,
//       description: req.body.description,
//       pdf_url: result.secure_url, // Cloudinary HTTPS
//     });

//     const created = await sermon.save();
//     res.status(201).json(created);
//   } catch (err) {
//     console.error('Add sermon error:', err);
//     res.status(400).json({ message: 'Sermon upload failed', error: String(err) });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Sermon = require('../models/Sermon');

const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

// Memory storage (Render disk issues నివారించేందుకు)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    // PDF మాత్రమే అంగీకరించు
    const ok = file.mimetype === 'application/pdf' || (file.originalname || '').toLowerCase().endsWith('.pdf');
    if (!ok) return cb(new Error('Only PDF files are allowed'));
    cb(null, true);
  }
});

/* =================== GET: /api/sermons =================== */
router.get('/', async (_req, res) => {
  try {
    const sermons = await Sermon.find().sort({ title: 1 });

    // absolute URL అయితే అలాగే రిటర్న్; relative అయితే base add చెయ్యి
    const base = `${_req?.protocol || 'https'}://${_req?.get?.('host') || ''}/`;
    const mapUrl = (u) => {
      if (!u) return '';
      return /^https?:\/\//i.test(u) ? u : new URL(u, base).toString();
    };

    const out = sermons.map(s => ({
      ...s._doc,
      pdf_url: mapUrl(s.pdf_url),
    }));

    const authors = await Sermon.distinct('author');
    const categories = await Sermon.distinct('category');

    res.json({ sermons: out, authors, categories });
  } catch (err) {
    console.error('Get sermons error:', err);
    res.status(500).json({ message: err.message || 'Failed to load sermons' });
  }
});

/* =================== POST: /api/sermons  (field: 'pdf') =================== */
/* Cloudinaryకి PDFs ని 'auto' తో upload చేస్తాం (raw కన్నా బాగా browser-friendly). */
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required (field 'pdf')." });
    }

    const { title, author, category, description } = req.body;
    if (!title || !author || !category || !description) {
      return res.status(400).json({ message: 'title, author, category, description are required' });
    }

    const folder =
      process.env.CLOUDINARY_FOLDER_SERMONS ||
      process.env.CLOUDINARY_SERMONS_FOLDER ||
      'bible-mining/sermons';

    const result = await new Promise((resolve, reject) => {
      const up = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',   // 👈 కీలకం: raw బదులుగా auto
          type: 'upload',
          folder,
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (err, r) => (err ? reject(err) : resolve(r))
      );
      streamifier.createReadStream(req.file.buffer).pipe(up);
    });

    // result.secure_url — బ్రౌజర్ ఓపెన్‌కు సరిపడే permanent HTTPS
    const doc = new Sermon({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      description: description.trim(),
      pdf_url: result.secure_url,
      // ఐచ్చిక: పక్కన సేవ్ చేసుకోవచ్చు
      pdf_public_id: result.public_id,
      pdf_mime: result.resource_type === 'raw' ? 'application/pdf' : (result.format === 'pdf' ? 'application/pdf' : ''),
      pdf_bytes: result.bytes,
    });

    const created = await doc.save();
    res.status(201).json(created);
  } catch (err) {
    console.error('Add sermon error:', err);
    res.status(400).json({ message: 'Sermon upload failed', error: String(err?.message || err) });
  }
});

module.exports = router;
