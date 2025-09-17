// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// mongoose.connect('mongodb://localhost:27017/biblemining', {})
// .then(() => {
//   console.log('MongoDB connected...');
// })
// .catch(err => console.log(err));

// const songsRouter = require('./routes/songs');
// app.use('/api/songs', songsRouter);

// const sermonsRouter = require('./routes/sermons');
// app.use('/api/sermons', sermonsRouter);

// const galleryRouter = require('./routes/gallery');
// app.use('/api/gallery', galleryRouter);

// const videosRouter = require('./routes/videos');
// app.use('/api/videos', videosRouter);

// const contactRouter = require('./routes/contact');
// app.use('/api/contact', contactRouter);

// const homepageRouter = require('./routes/homepage');
// app.use('/api/homepage', homepageRouter);

// const logoRouter = require('./routes/logo');
// app.use('/api/logo', logoRouter);

// const blogRouter = require('./routes/blog');
// app.use('/api/blog', blogRouter);

// const aboutRouter = require('./routes/about');
// app.use('/api/about', aboutRouter);

// const authRouter = require('./routes/auth'); // కొత్త రూట్‌ను ఇంపోర్ట్ చేయడం
// app.use('/api/auth', authRouter); // కొత్త రూట్‌ను ఉపయోగించడం

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// === PATCHED by ChatGPT: Atlas + CORS + Healthcheck + Case-safe routes ===


// const path = require('path'); // [PATCH] path for static uploads
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv'); // [PATCH] load env

// dotenv.config(); // [PATCH] read .env



// const app = express();
// const PORT = process.env.PORT || 5000;

// // [PATCH] CORS tightened (fallback '*' if CORS_ORIGIN not set)
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || '*',
//   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   credentials: true,
// }));

// app.use(express.json());

// // [PATCH] serve uploads folder (note: Render free tier lo persistent kaadhu)
// const uploadsDir = path.join(__dirname, 'uploads');
// app.use('/uploads', express.static(uploadsDir));

// // [PATCH] Use Atlas from env (fallback to local only if env missing)
// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// mongoose.connect(mongoUri)
//   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err?.message || err);
//     process.exit(1);
//   });

// // ---- Routes (case-sensitive on Linux/Render) ----
// // [PATCH] Songs file is 'Songs.js' (capital S), so require with 'Songs'
// const songsRouter = require('./routes/Songs'); // [PATCH] was ./routes/songs
// app.use('/api/songs', songsRouter);

// const sermonsRouter = require('./routes/sermons');
// app.use('/api/sermons', sermonsRouter);

// const galleryRouter = require('./routes/gallery');
// app.use('/api/gallery', galleryRouter);

// const videosRouter = require('./routes/videos');
// app.use('/api/videos', videosRouter);

// const contactRouter = require('./routes/contact');
// app.use('/api/contact', contactRouter);

// const homepageRouter = require('./routes/homepage');
// app.use('/api/homepage', homepageRouter);

// const logoRouter = require('./routes/logo');
// app.use('/api/logo', logoRouter);

// const blogRouter = require('./routes/blog');
// app.use('/api/blog', blogRouter);

// const aboutRouter = require('./routes/about');
// app.use('/api/about', aboutRouter);

// const authRouter = require('./routes/auth');
// app.use('/api/auth', authRouter);

// // [PATCH] Health check (Render health checks too)
// app.get('/health', (_req, res) => {
//   res.json({ ok: true, uptime: process.uptime() });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


// === server.js (Bible Mining) ===
// NOTE: ఈ వెర్షన్‌లో uploads/songs డైరెక్టరీ ఆటో-క్రియేట్ అవుతుంది
//       మరియు '/uploads' ని absolute path తో serve చేస్తుంది.

// const path = require('path');
// const fs = require('fs');                     // [CHANGE] uploads ఫోల్డర్లు సృష్టించడానికి
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// /* ---------------- CORS ---------------- */
// // [WHY] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || '*',
//   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   credentials: true,
// }));

// app.use(express.json());

// /* ---------------- Uploads bootstrap ---------------- */
// // [CHANGE] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టిస్తున్నాం
// const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// ['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేస్కోవచ్చు */]
//   .forEach((sub) => {
//     try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
//   });

// // [CHANGE] absolute path తో static serve (CWD issues నివారించడానికి)
// app.use('/uploads', express.static(UPLOAD_ROOT));

// /* ---------------- Mongo ---------------- */
// // [WHY] Atlas URL .env లో MONGODB_URI గా వస్తుంది; లేకపోతే local
// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// mongoose.connect(mongoUri)
//   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err?.message || err);
//     process.exit(1);
//   });

// /* ---------------- Routes ---------------- */
// // [CHANGE] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
// const songsRouter = require('./routes/Songs');
// app.use('/api/songs', songsRouter);

// const sermonsRouter = require('./routes/sermons');
// app.use('/api/sermons', sermonsRouter);

// const galleryRouter = require('./routes/gallery');
// app.use('/api/gallery', galleryRouter);

// const videosRouter = require('./routes/videos');
// app.use('/api/videos', videosRouter);

// const contactRouter = require('./routes/contact');
// app.use('/api/contact', contactRouter);

// const homepageRouter = require('./routes/homepage');
// app.use('/api/homepage', homepageRouter);

// const logoRouter = require('./routes/logo');
// app.use('/api/logo', logoRouter);

// const blogRouter = require('./routes/blog');
// app.use('/api/blog', blogRouter);

// const aboutRouter = require('./routes/about');
// app.use('/api/about', aboutRouter);

// const authRouter = require('./routes/auth');
// app.use('/api/auth', authRouter);

// /* ---------------- Health ---------------- */
// app.get('/health', (_req, res) => {
//   res.json({ ok: true, uptime: process.uptime() });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// server.js

// const path = require('path');
// const fs = require('fs'); // [PATCH] uploads ఫోల్డర్లు సృష్టించడానికి
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// /* ---------------- Express base ---------------- */
// app.set('trust proxy', true); // [PATCH] Render/Proxy వెనుక protocol సరిగా రావడానికి
// app.use(express.json());

// /* ---------------- CORS (comma-separated origins supported) ---------------- */
// // [PATCH] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి; comma list ని array గా treat చేస్తాం
// const rawOrigins = process.env.CORS_ORIGIN || '*';
// const allowList = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

// const corsOptions = {
//   origin: allowList.includes('*')
//     ? true
//     : function (origin, cb) {
//         // same-origin/SSR/no-origin requests కూడా allow చేయాలి
//         if (!origin) return cb(null, true);
//         cb(null, allowList.includes(origin));
//       },
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// /* ---------------- Uploads bootstrap ---------------- */
// // [PATCH] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టించడం
// const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// ['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేసుకోవచ్చు */]
//   .forEach((sub) => {
//     try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
//   });

// // [PATCH] absolute path తో static serve (CWD issues నివారించడానికి)
// app.use('/uploads', express.static(UPLOAD_ROOT));

// /* ---------------- Mongo ---------------- */
// // [WHY] Atlas URL .env లో MONGODB_URI గా వస్తుంది; లేకపోతే local
// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// mongoose.connect(mongoUri)
//   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err?.message || err);
//     process.exit(1);
//   });

// /* ---------------- Routes ---------------- */
// // [PATCH] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
// const songsRouter = require('./routes/Songs');
// app.use('/api/songs', songsRouter);

// const sermonsRouter = require('./routes/sermons');
// app.use('/api/sermons', sermonsRouter);

// const galleryRouter = require('./routes/gallery');
// app.use('/api/gallery', galleryRouter);

// const videosRouter = require('./routes/videos');
// app.use('/api/videos', videosRouter);

// const contactRouter = require('./routes/contact');
// app.use('/api/contact', contactRouter);

// const homepageRouter = require('./routes/homepage');
// app.use('/api/homepage', homepageRouter);

// const logoRouter = require('./routes/logo');
// app.use('/api/logo', logoRouter);

// const blogRouter = require('./routes/blog');
// app.use('/api/blog', blogRouter);

// const aboutRouter = require('./routes/about');
// app.use('/api/about', aboutRouter);

// const authRouter = require('./routes/auth');
// app.use('/api/auth', authRouter);

// /* ---------------- Health ---------------- */
// app.get('/health', (_req, res) => {
//   res.json({ ok: true, uptime: process.uptime() });
// });

// /* ---------------- DEBUG (uploads on disk) ---------------- */
// // [PATCH] — తాత్కాలికంగా: సర్వర్ డిస్క్‌లో uploads/songs లోని ఫైళ్ల లిస్ట్ చూడటానికి
// app.get('/debug/uploads/songs', (req, res) => {
//   try {
//     const dir = path.join(__dirname, 'uploads', 'songs');
//     const exists = fs.existsSync(dir);
//     const files = exists ? fs.readdirSync(dir) : [];
//     res.json({ dir, exists, files });
//   } catch (e) {
//     res.status(500).json({ error: String(e) });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// server.js

// const path = require('path');
// const fs = require('fs'); // [PATCH] uploads ఫోల్డర్లు సృష్టించడానికి
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// /* ---------------- Express base ---------------- */
// app.set('trust proxy', true); // [PATCH] Render/Proxy వెనుక protocol సరిగా రావడానికి
// app.use(express.json());

// /* ---------------- CORS (comma-separated origins supported) ---------------- */
// // [PATCH] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి; comma list ని array గా treat చేస్తాం
// const rawOrigins = process.env.CORS_ORIGIN || '*';
// const allowList = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

// const corsOptions = {
//   origin: allowList.includes('*')
//     ? true
//     : function (origin, cb) {
//         // same-origin/SSR/no-origin requests కూడా allow చేయాలి
//         if (!origin) return cb(null, true);
//         cb(null, allowList.includes(origin));
//       },
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// /* ---------------- Uploads bootstrap ---------------- */
// // [PATCH] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టించడం
// const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// ['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేసుకోవచ్చు */]
//   .forEach((sub) => {
//     try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
//   });

// // [PATCH] absolute path తో static serve (CWD issues నివారించడానికి)
// app.use('/uploads', express.static(UPLOAD_ROOT));

// /* ---------------- Mongo ---------------- */
// // [WHY] Atlas URL .env లో MONGODB_URI గా వస్తుంది; లేకపోతే local
// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// mongoose.connect(mongoUri)
//   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err?.message || err);
//     process.exit(1);
//   });

// /* ---------------- Routes ---------------- */
// // [PATCH] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
// const songsRouter = require('./routes/Songs');
// app.use('/api/songs', songsRouter);

// const sermonsRouter = require('./routes/sermons');
// app.use('/api/sermons', sermonsRouter);

// const galleryRouter = require('./routes/gallery');
// app.use('/api/gallery', galleryRouter);

// const videosRouter = require('./routes/videos');
// app.use('/api/videos', videosRouter);

// const contactRouter = require('./routes/contact');
// app.use('/api/contact', contactRouter);

// const homepageRouter = require('./routes/homepage');
// app.use('/api/homepage', homepageRouter);

// const logoRouter = require('./routes/logo');
// app.use('/api/logo', logoRouter);

// const blogRouter = require('./routes/blog');
// app.use('/api/blog', blogRouter);

// const aboutRouter = require('./routes/about');
// app.use('/api/about', aboutRouter);

// const authRouter = require('./routes/auth');
// app.use('/api/auth', authRouter);

// /* ---------------- Health ---------------- */
// app.get('/health', (_req, res) => {
//   res.json({ ok: true, uptime: process.uptime() });
// });

// /* ---------------- DEBUG (uploads on disk) ---------------- */
// // [PATCH] — తాత్కాలికంగా: సర్వర్ డిస్క్‌లో uploads/songs లోని ఫైళ్ల లిస్ట్ చూడటానికి
// app.get('/debug/uploads/songs', (req, res) => {
//   try {
//     const dir = path.join(__dirname, 'uploads', 'songs');
//     const exists = fs.existsSync(dir);
//     const files = exists ? fs.readdirSync(dir) : [];
//     res.json({ dir, exists, files });
//   } catch (e) {
//     res.status(500).json({ error: String(e) });
//   }
// });

// /* ---------------- DEBUG (Cloudinary env check) ---------------- */
// // [PATCH] — సెన్సిటివ్ values చూపించకుండా set/missing గా చూపిస్తుంది
// app.get('/debug/cloudinary', (req, res) => {
//   res.json({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
//     api_key:    process.env.CLOUDINARY_API_KEY    ? 'set' : 'missing',
//     api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
//     folder:     process.env.CLOUDINARY_FOLDER || 'default',
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const path = require('path');
const fs = require('fs'); // [PATCH] uploads ఫోల్డర్లు సృష్టించడానికి
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Readable } = require('stream'); // [ADD] proxy streaming కోసం

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- Express base ---------------- */
app.set('trust proxy', true); // [PATCH] Render/Proxy వెనుక protocol సరిగా రావడానికి
app.use(express.json());

/* ---------------- CORS (comma-separated origins supported) ---------------- */
// [PATCH] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి; comma list ని array గా treat చేస్తాం
const rawOrigins = process.env.CORS_ORIGIN || '*';
const allowList = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: allowList.includes('*')
    ? true
    : function (origin, cb) {
        // same-origin/SSR/no-origin requests కూడా allow చేయాలి
        if (!origin) return cb(null, true);
        cb(null, allowList.includes(origin));
      },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));

/* ---------------- Uploads bootstrap ---------------- */
// [PATCH] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టించడం
const UPLOAD_ROOT = path.join(__dirname, 'uploads');
['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేసుకోవచ్చు */]
  .forEach((sub) => {
    try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
  });

// [PATCH] absolute path తో static serve (CWD issues నివారించడానికి)
app.use('/uploads', express.static(UPLOAD_ROOT));

/* ---------------- Mongo ---------------- */
// [WHY] Atlas URL .env లో MONGODB_URI గా వస్తుంది; లేకపోతే local
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err?.message || err);
    process.exit(1);
  });

/* ---------------- Routes ---------------- */
// [PATCH] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
const songsRouter = require('./routes/Songs');
app.use('/api/songs', songsRouter);

const sermonsRouter = require('./routes/sermons');
app.use('/api/sermons', sermonsRouter);

const galleryRouter = require('./routes/gallery');
app.use('/api/gallery', galleryRouter);

const videosRouter = require('./routes/videos');
app.use('/api/videos', videosRouter);

const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);

const homepageRouter = require('./routes/homepage');
app.use('/api/homepage', homepageRouter);

const logoRouter = require('./routes/logo');
app.use('/api/logo', logoRouter);

const blogRouter = require('./routes/blog');
app.use('/api/blog', blogRouter);

const aboutRouter = require('./routes/about');
app.use('/api/about', aboutRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

/* ---------------- Health ---------------- */
app.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

/* ---------------- DEBUG (uploads on disk) ---------------- */
// [PATCH] — తాత్కాలికంగా: సర్వర్ డిస్క్‌లో uploads/songs లోని ఫైళ్ల లిస్ట్ చూడటానికి
app.get('/debug/uploads/songs', (req, res) => {
  try {
    const dir = path.join(__dirname, 'uploads', 'songs');
    const exists = fs.existsSync(dir);
    const files = exists ? fs.readdirSync(dir) : [];
    res.json({ dir, exists, files });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/* ---------------- DEBUG (Cloudinary env check) ---------------- */
// [PATCH] — సెన్సిటివ్ values చూపించకుండా set/missing గా చూపిస్తుంది
app.get('/debug/cloudinary', (req, res) => {
  res.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
    api_key:    process.env.CLOUDINARY_API_KEY    ? 'set' : 'missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
    // folders (songs + sermons) for quick sanity checks
    folder_songs:   process.env.CLOUDINARY_FOLDER || 'default',
    folder_sermons: process.env.CLOUDINARY_FOLDER_SERMONS || process.env.CLOUDINARY_SERMONS_FOLDER || 'bible-mining/sermons',
    pdf_proxy_allowed_hosts: process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com',
  });
});

/* ---------------- PDF Proxy (for iframe-safe PDF preview) ---------------- */
/* ఈ రూట్ వల్ల Cloudinary PDFని మన సర్వర్ నుంచి inlineగా స్ట్రీమ్ చేస్తాం.
   Browsersలో “refused to connect / x-frame-options” type సమస్యలు దాదాపు నివారిస్తాం. */
app.get('/proxy/pdf', async (req, res) => {
  try {
    const raw = req.query.url;
    if (!raw) return res.status(400).send('Missing url');

    let u;
    try { u = new URL(raw); } catch { return res.status(400).send('Bad url'); }

    const allowedHosts = (process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com')
      .split(',')
      .map(h => h.trim().toLowerCase())
      .filter(Boolean);

    if (u.protocol !== 'https:') return res.status(400).send('HTTPS only');
    if (!allowedHosts.includes(u.hostname.toLowerCase())) return res.status(400).send('Host not allowed');
    if (!u.pathname.toLowerCase().endsWith('.pdf')) return res.status(400).send('PDF only');

    // Node 18+ లో global fetch ఉంటుంది; లేకపోతే node-fetch fallback వాడుతాం
    let fetchFn = global.fetch;
    if (typeof fetchFn !== 'function') {
      try {
        fetchFn = (await import('node-fetch')).default;
      } catch {
        return res.status(500).send('fetch not available (install node-fetch@3)');
      }
    }

    const upstream = await fetchFn(u.toString());
    if (!upstream.ok) return res.status(upstream.status).send('Upstream error');

    const fname = path.basename(u.pathname) || 'file.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fname}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    if (upstream.body) {
      // web stream → Node Readable (Node 18+ కి fromWeb ఉంటుంది)
      if (Readable.fromWeb) {
        Readable.fromWeb(upstream.body).pipe(res);
      } else if (typeof upstream.body.pipe === 'function') {
        upstream.body.pipe(res);
      } else {
        const buf = Buffer.from(await upstream.arrayBuffer());
        res.end(buf);
      }
    } else {
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.end(buf);
    }
  } catch (e) {
    console.error('PDF proxy error:', e);
    res.status(500).send('Proxy failed');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
