// // // // const express = require('express');
// // // // const mongoose = require('mongoose');
// // // // const cors = require('cors');

// // // // const app = express();
// // // // const PORT = process.env.PORT || 5000;

// // // // app.use(cors());
// // // // app.use(express.json());
// // // // app.use('/uploads', express.static('uploads'));

// // // // mongoose.connect('mongodb://localhost:27017/biblemining', {})
// // // // .then(() => {
// // // //   console.log('MongoDB connected...');
// // // // })
// // // // .catch(err => console.log(err));

// // // // const songsRouter = require('./routes/songs');
// // // // app.use('/api/songs', songsRouter);

// // // // const sermonsRouter = require('./routes/sermons');
// // // // app.use('/api/sermons', sermonsRouter);

// // // // const galleryRouter = require('./routes/gallery');
// // // // app.use('/api/gallery', galleryRouter);

// // // // const videosRouter = require('./routes/videos');
// // // // app.use('/api/videos', videosRouter);

// // // // const contactRouter = require('./routes/contact');
// // // // app.use('/api/contact', contactRouter);

// // // // const homepageRouter = require('./routes/homepage');
// // // // app.use('/api/homepage', homepageRouter);

// // // // const logoRouter = require('./routes/logo');
// // // // app.use('/api/logo', logoRouter);

// // // // const blogRouter = require('./routes/blog');
// // // // app.use('/api/blog', blogRouter);

// // // // const aboutRouter = require('./routes/about');
// // // // app.use('/api/about', aboutRouter);

// // // // const authRouter = require('./routes/auth'); // కొత్త రూట్‌ను ఇంపోర్ట్ చేయడం
// // // // app.use('/api/auth', authRouter); // కొత్త రూట్‌ను ఉపయోగించడం

// // // // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // // // === PATCHED by ChatGPT: Atlas + CORS + Healthcheck + Case-safe routes ===


// // // // const path = require('path'); // [PATCH] path for static uploads
// // // // const express = require('express');
// // // // const mongoose = require('mongoose');
// // // // const cors = require('cors');
// // // // const dotenv = require('dotenv'); // [PATCH] load env

// // // // dotenv.config(); // [PATCH] read .env



// // // // const app = express();
// // // // const PORT = process.env.PORT || 5000;

// // // // // [PATCH] CORS tightened (fallback '*' if CORS_ORIGIN not set)
// // // // app.use(cors({
// // // //   origin: process.env.CORS_ORIGIN || '*',
// // // //   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
// // // //   credentials: true,
// // // // }));

// // // // app.use(express.json());

// // // // // [PATCH] serve uploads folder (note: Render free tier lo persistent kaadhu)
// // // // const uploadsDir = path.join(__dirname, 'uploads');
// // // // app.use('/uploads', express.static(uploadsDir));

// // // // // [PATCH] Use Atlas from env (fallback to local only if env missing)
// // // // const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// // // // mongoose.connect(mongoUri)
// // // //   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
// // // //   .catch(err => {
// // // //     console.error('❌ MongoDB connection error:', err?.message || err);
// // // //     process.exit(1);
// // // //   });

// // // // // ---- Routes (case-sensitive on Linux/Render) ----
// // // // // [PATCH] Songs file is 'Songs.js' (capital S), so require with 'Songs'
// // // // const songsRouter = require('./routes/Songs'); // [PATCH] was ./routes/songs
// // // // app.use('/api/songs', songsRouter);

// // // // const sermonsRouter = require('./routes/sermons');
// // // // app.use('/api/sermons', sermonsRouter);

// // // // const galleryRouter = require('./routes/gallery');
// // // // app.use('/api/gallery', galleryRouter);

// // // // const videosRouter = require('./routes/videos');
// // // // app.use('/api/videos', videosRouter);

// // // // const contactRouter = require('./routes/contact');
// // // // app.use('/api/contact', contactRouter);

// // // // const homepageRouter = require('./routes/homepage');
// // // // app.use('/api/homepage', homepageRouter);

// // // // const logoRouter = require('./routes/logo');
// // // // app.use('/api/logo', logoRouter);

// // // // const blogRouter = require('./routes/blog');
// // // // app.use('/api/blog', blogRouter);

// // // // const aboutRouter = require('./routes/about');
// // // // app.use('/api/about', aboutRouter);

// // // // const authRouter = require('./routes/auth');
// // // // app.use('/api/auth', authRouter);

// // // // // [PATCH] Health check (Render health checks too)
// // // // app.get('/health', (_req, res) => {
// // // //   res.json({ ok: true, uptime: process.uptime() });
// // // // });

// // // // app.listen(PORT, () => {
// // // //   console.log(`🚀 Server running on port ${PORT}`);
// // // // });


// // // // === server.js (Bible Mining) ===
// // // // NOTE: ఈ వెర్షన్‌లో uploads/songs డైరెక్టరీ ఆటో-క్రియేట్ అవుతుంది
// // // //       మరియు '/uploads' ని absolute path తో serve చేస్తుంది.

// // // // const path = require('path');
// // // // const fs = require('fs');                     // [CHANGE] uploads ఫోల్డర్లు సృష్టించడానికి
// // // // const express = require('express');
// // // // const mongoose = require('mongoose');
// // // // const cors = require('cors');
// // // // const dotenv = require('dotenv');

// // // // dotenv.config();

// // // // const app = express();
// // // // const PORT = process.env.PORT || 5000;

// // // // /* ---------------- CORS ---------------- */
// // // // // [WHY] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి
// // // // app.use(cors({
// // // //   origin: process.env.CORS_ORIGIN || '*',
// // // //   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
// // // //   credentials: true,
// // // // }));

// // // // app.use(express.json());

// // // // /* ---------------- Uploads bootstrap ---------------- */
// // // // // [CHANGE] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టిస్తున్నాం
// // // // const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// // // // ['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేస్కోవచ్చు */]
// // // //   .forEach((sub) => {
// // // //     try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
// // // //   });

// // // // // [CHANGE] absolute path తో static serve (CWD issues నివారించడానికి)
// // // // app.use('/uploads', express.static(UPLOAD_ROOT));

// // // // /* ---------------- Mongo ---------------- */
// // // // // [WHY] Atlas URL .env లో MONGODB_URI గా వస్తుంది; లేకపోతే local
// // // // const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// // // // mongoose.connect(mongoUri)
// // // //   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
// // // //   .catch(err => {
// // // //     console.error('❌ MongoDB connection error:', err?.message || err);
// // // //     process.exit(1);
// // // //   });

// // // // /* ---------------- Routes ---------------- */
// // // // // [CHANGE] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
// // // // const songsRouter = require('./routes/Songs');
// // // // app.use('/api/songs', songsRouter);

// // // // const sermonsRouter = require('./routes/sermons');
// // // // app.use('/api/sermons', sermonsRouter);

// // // // const galleryRouter = require('./routes/gallery');
// // // // app.use('/api/gallery', galleryRouter);

// // // // const videosRouter = require('./routes/videos');
// // // // app.use('/api/videos', videosRouter);

// // // // const contactRouter = require('./routes/contact');
// // // // app.use('/api/contact', contactRouter);

// // // // const homepageRouter = require('./routes/homepage');
// // // // app.use('/api/homepage', homepageRouter);

// // // // const logoRouter = require('./routes/logo');
// // // // app.use('/api/logo', logoRouter);

// // // // const blogRouter = require('./routes/blog');
// // // // app.use('/api/blog', blogRouter);

// // // // const aboutRouter = require('./routes/about');
// // // // app.use('/api/about', aboutRouter);

// // // // const authRouter = require('./routes/auth');
// // // // app.use('/api/auth', authRouter);

// // // // /* ---------------- Health ---------------- */
// // // // app.get('/health', (_req, res) => {
// // // //   res.json({ ok: true, uptime: process.uptime() });
// // // // });

// // // // app.listen(PORT, () => {
// // // //   console.log(`🚀 Server running on port ${PORT}`);
// // // // });

// // // // server.js

// // // // const path = require('path');
// // // // const fs = require('fs'); // [PATCH] uploads ఫోల్డర్లు సృష్టించడానికి
// // // // const express = require('express');
// // // // const mongoose = require('mongoose');
// // // // const cors = require('cors');
// // // // const dotenv = require('dotenv');

// // // // dotenv.config();

// // // // const app = express();
// // // // const PORT = process.env.PORT || 5000;

// // // // /* ---------------- Express base ---------------- */
// // // // app.set('trust proxy', true); // [PATCH] Render/Proxy వెనుక protocol సరిగా రావడానికి
// // // // app.use(express.json());

// // // // /* ---------------- CORS (comma-separated origins supported) ---------------- */
// // // // // [PATCH] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి; comma list ని array గా treat చేస్తాం
// // // // const rawOrigins = process.env.CORS_ORIGIN || '*';
// // // // const allowList = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

// // // // const corsOptions = {
// // // //   origin: allowList.includes('*')
// // // //     ? true
// // // //     : function (origin, cb) {
// // // //         // same-origin/SSR/no-origin requests కూడా allow చేయాలి
// // // //         if (!origin) return cb(null, true);
// // // //         cb(null, allowList.includes(origin));
// // // //       },
// // // //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// // // //   credentials: true,
// // // // };
// // // // app.use(cors(corsOptions));

// // // // /* ---------------- Uploads bootstrap ---------------- */
// // // // // [PATCH] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టించడం
// // // // const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// // // // ['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేసుకోవచ్చు */]
// // // //   .forEach((sub) => {
// // // //     try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
// // // //   });

// // // // // [PATCH] absolute path తో static serve (CWD issues నివారించడానికి)
// // // // app.use('/uploads', express.static(UPLOAD_ROOT));

// // // // /* ---------------- Mongo ---------------- */
// // // // // [WHY] Atlas URL .env లో MONGODB_URI గా వస్తుంది; లేకపోతే local
// // // // const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// // // // mongoose.connect(mongoUri)
// // // //   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
// // // //   .catch(err => {
// // // //     console.error('❌ MongoDB connection error:', err?.message || err);
// // // //     process.exit(1);
// // // //   });

// // // // /* ---------------- Routes ---------------- */
// // // // // [PATCH] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
// // // // const songsRouter = require('./routes/Songs');
// // // // app.use('/api/songs', songsRouter);

// // // // const sermonsRouter = require('./routes/sermons');
// // // // app.use('/api/sermons', sermonsRouter);

// // // // const galleryRouter = require('./routes/gallery');
// // // // app.use('/api/gallery', galleryRouter);

// // // // const videosRouter = require('./routes/videos');
// // // // app.use('/api/videos', videosRouter);

// // // // const contactRouter = require('./routes/contact');
// // // // app.use('/api/contact', contactRouter);

// // // // const homepageRouter = require('./routes/homepage');
// // // // app.use('/api/homepage', homepageRouter);

// // // // const logoRouter = require('./routes/logo');
// // // // app.use('/api/logo', logoRouter);

// // // // const blogRouter = require('./routes/blog');
// // // // app.use('/api/blog', blogRouter);

// // // // const aboutRouter = require('./routes/about');
// // // // app.use('/api/about', aboutRouter);

// // // // const authRouter = require('./routes/auth');
// // // // app.use('/api/auth', authRouter);

// // // // /* ---------------- Health ---------------- */
// // // // app.get('/health', (_req, res) => {
// // // //   res.json({ ok: true, uptime: process.uptime() });
// // // // });

// // // // /* ---------------- DEBUG (uploads on disk) ---------------- */
// // // // // [PATCH] — తాత్కాలికంగా: సర్వర్ డిస్క్‌లో uploads/songs లోని ఫైళ్ల లిస్ట్ చూడటానికి
// // // // app.get('/debug/uploads/songs', (req, res) => {
// // // //   try {
// // // //     const dir = path.join(__dirname, 'uploads', 'songs');
// // // //     const exists = fs.existsSync(dir);
// // // //     const files = exists ? fs.readdirSync(dir) : [];
// // // //     res.json({ dir, exists, files });
// // // //   } catch (e) {
// // // //     res.status(500).json({ error: String(e) });
// // // //   }
// // // // });

// // // // app.listen(PORT, () => {
// // // //   console.log(`🚀 Server running on port ${PORT}`);
// // // // });

// // // // server.js

// // // // const path = require('path');
// // // // const fs = require('fs'); // [PATCH] uploads ఫోల్డర్లు సృష్టించడానికి
// // // // const express = require('express');
// // // // const mongoose = require('mongoose');
// // // // const cors = require('cors');
// // // // const dotenv = require('dotenv');

// // // // dotenv.config();

// // // // const app = express();
// // // // const PORT = process.env.PORT || 5000;

// // // // /* ---------------- Express base ---------------- */
// // // // app.set('trust proxy', true); // [PATCH] Render/Proxy వెనుక protocol సరిగా రావడానికి
// // // // app.use(express.json());

// // // // /* ---------------- CORS (comma-separated origins supported) ---------------- */
// // // // // [PATCH] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి; comma list ని array గా treat చేస్తాం
// // // // const rawOrigins = process.env.CORS_ORIGIN || '*';
// // // // const allowList = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

// // // // const corsOptions = {
// // // //   origin: allowList.includes('*')
// // // //     ? true
// // // //     : function (origin, cb) {
// // // //         // same-origin/SSR/no-origin requests కూడా allow చేయాలి
// // // //         if (!origin) return cb(null, true);
// // // //         cb(null, allowList.includes(origin));
// // // //       },
// // // //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// // // //   credentials: true,
// // // // };
// // // // app.use(cors(corsOptions));

// // // // /* ---------------- Uploads bootstrap ---------------- */
// // // // // [PATCH] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టించడం
// // // // const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// // // // ['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేసుకోవచ్చు */]
// // // //   .forEach((sub) => {
// // // //     try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
// // // //   });

// // // // // [PATCH] absolute path తో static serve (CWD issues నివారించడానికి)
// // // // app.use('/uploads', express.static(UPLOAD_ROOT));

// // /* ---------------- Mongo ---------------- */
// // // [WHY] Atlas URL .env లో MONGODB_URI గా వస్తుంది; లేకపోతే local
// // const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// // mongoose.connect(mongoUri)
// //   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
// //   .catch(err => {
// //     console.error('❌ MongoDB connection error:', err?.message || err);
// //     process.exit(1);
// //   });

// // /* ---------------- Routes ---------------- */
// // // [PATCH] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
// // const songsRouter = require('./routes/Songs');
// // app.use('/api/songs', songsRouter);

// // const sermonsRouter = require('./routes/sermons');
// // app.use('/api/sermons', sermonsRouter);

// // const galleryRouter = require('./routes/gallery');
// // app.use('/api/gallery', galleryRouter);

// // const videosRouter = require('./routes/videos');
// // app.use('/api/videos', videosRouter);

// // const contactRouter = require('./routes/contact');
// // app.use('/api/contact', contactRouter);

// // const homepageRouter = require('./routes/homepage');
// // app.use('/api/homepage', homepageRouter);

// // const logoRouter = require('./routes/logo');
// // app.use('/api/logo', logoRouter);

// // const blogRouter = require('./routes/blog');
// // app.use('/api/blog', blogRouter);

// // const aboutRouter = require('./routes/about');
// // app.use('/api/about', aboutRouter);

// // const authRouter = require('./routes/auth');
// // app.use('/api/auth', authRouter);

// // /* ---------------- Health ---------------- */
// // app.get('/health', (_req, res) => {
// //   res.json({ ok: true, uptime: process.uptime() });
// // });

// // /* ---------------- DEBUG (uploads on disk) ---------------- */
// // // [PATCH] — తాత్కాలికంగా: సర్వర్ డిస్క్‌లో uploads/songs లోని ఫైళ్ల లిస్ట్ చూడటానికి
// // app.get('/debug/uploads/songs', (req, res) => {
// //   try {
// //     const dir = path.join(__dirname, 'uploads', 'songs');
// //     const exists = fs.existsSync(dir);
// //     const files = exists ? fs.readdirSync(dir) : [];
// //     res.json({ dir, exists, files });
// //   } catch (e) {
// //     res.status(500).json({ error: String(e) });
// //   }
// // });

// // /* ---------------- DEBUG (Cloudinary env check) ---------------- */
// // // [PATCH] — సెన్సిటివ్ values చూపించకుండా set/missing గా చూపిస్తుంది
// // app.get('/debug/cloudinary', (req, res) => {
// //   res.json({
// //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
// //     api_key:    process.env.CLOUDINARY_API_KEY    ? 'set' : 'missing',
// //     api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
// //     folder:     process.env.CLOUDINARY_FOLDER || 'default',
// //   });
// // });

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// // });

// // // // const path = require('path');
// // // // const fs = require('fs'); // [PATCH] uploads ఫోల్డర్లు సృష్టించడానికి
// // // // const express = require('express');
// // // // const mongoose = require('mongoose');
// // // // const cors = require('cors');
// // // // const dotenv = require('dotenv');
// // // // const { Readable } = require('stream'); // [ADD] proxy streaming కోసం

// // // // dotenv.config();

// // // // const app = express();
// // // // const PORT = process.env.PORT || 5000;

// // // // /* ---------------- Express base ---------------- */
// // // // app.set('trust proxy', true); // [PATCH] Render/Proxy వెనుక protocol సరిగా రావడానికి
// // // // app.use(express.json());

// // // // /* ---------------- CORS (comma-separated origins supported) ---------------- */
// // // // // [PATCH] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి; comma list ని array గా treat చేస్తాం
// // // // const rawOrigins = process.env.CORS_ORIGIN || '*';
// // // // const allowList = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

// // // // const corsOptions = {
// // // //   origin: allowList.includes('*')
// // // //     ? true
// // // //     : function (origin, cb) {
// // // //         // same-origin/SSR/no-origin requests కూడా allow చేయాలి
// // // //         if (!origin) return cb(null, true);
// // // //         cb(null, allowList.includes(origin));
// // // //       },
// // // //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// // // //   credentials: true,
// // // // };
// // // // app.use(cors(corsOptions));

// // // // /* ---------------- Uploads bootstrap ---------------- */
// // // // // [PATCH] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టించడం
// // // // const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// // // // ['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేసుకోవచ్చు */]
// // // //   .forEach((sub) => {
// // // //     try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
// // // //   });

// // // // // [PATCH] absolute path తో static serve (CWD issues నివారించడానికి)
// // // // app.use('/uploads', express.static(UPLOAD_ROOT));

// // // // /* ---------------- Mongo ---------------- */
// // // // // [WHY] Atlas URL .env లో MONGODB_URI గా వస్తుంది; లేకపోతే local
// // // // const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// // // // mongoose.connect(mongoUri)
// // // //   .then(() => console.log('✅ MongoDB connected:', mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'))
// // // //   .catch(err => {
// // // //     console.error('❌ MongoDB connection error:', err?.message || err);
// // // //     process.exit(1);
// // // //   });

// // // // /* ---------------- Routes ---------------- */
// // // // // [PATCH] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
// // // // const songsRouter = require('./routes/Songs');
// // // // app.use('/api/songs', songsRouter);

// // // // const sermonsRouter = require('./routes/sermons');
// // // // app.use('/api/sermons', sermonsRouter);

// // // // const galleryRouter = require('./routes/gallery');
// // // // app.use('/api/gallery', galleryRouter);

// // // // const videosRouter = require('./routes/videos');
// // // // app.use('/api/videos', videosRouter);

// // // // const contactRouter = require('./routes/contact');
// // // // app.use('/api/contact', contactRouter);

// // // // const homepageRouter = require('./routes/homepage');
// // // // app.use('/api/homepage', homepageRouter);

// // // // const logoRouter = require('./routes/logo');
// // // // app.use('/api/logo', logoRouter);

// // // // const blogRouter = require('./routes/blog');
// // // // app.use('/api/blog', blogRouter);

// // // // const aboutRouter = require('./routes/about');
// // // // app.use('/api/about', aboutRouter);

// // // // const authRouter = require('./routes/auth');
// // // // app.use('/api/auth', authRouter);

// // // // /* ---------------- Health ---------------- */
// // // // app.get('/health', (_req, res) => {
// // // //   res.json({ ok: true, uptime: process.uptime() });
// // // // });

// // // // /* ---------------- DEBUG (uploads on disk) ---------------- */
// // // // // [PATCH] — తాత్కాలికంగా: సర్వర్ డిస్క్‌లో uploads/songs లోని ఫైళ్ల లిస్ట్ చూడటానికి
// // // // app.get('/debug/uploads/songs', (req, res) => {
// // // //   try {
// // // //     const dir = path.join(__dirname, 'uploads', 'songs');
// // // //     const exists = fs.existsSync(dir);
// // // //     const files = exists ? fs.readdirSync(dir) : [];
// // // //     res.json({ dir, exists, files });
// // // //   } catch (e) {
// // // //     res.status(500).json({ error: String(e) });
// // // //   }
// // // // });

// // // // /* ---------------- DEBUG (Cloudinary env check) ---------------- */
// // // // // [PATCH] — సెన్సిటివ్ values చూపించకుండా set/missing గా చూపిస్తుంది
// // // // app.get('/debug/cloudinary', (req, res) => {
// // // //   res.json({
// // // //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
// // // //     api_key:    process.env.CLOUDINARY_API_KEY    ? 'set' : 'missing',
// // // //     api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
// // // //     // folders (songs + sermons) for quick sanity checks
// // // //     folder_songs:   process.env.CLOUDINARY_FOLDER || 'default',
// // // //     folder_sermons: process.env.CLOUDINARY_FOLDER_SERMONS || process.env.CLOUDINARY_SERMONS_FOLDER || 'bible-mining/sermons',
// // // //     pdf_proxy_allowed_hosts: process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com',
// // // //   });
// // // // });

// // // // /* ---------------- PDF Proxy (for iframe-safe PDF preview) ---------------- */
// // // // /* ఈ రూట్ వల్ల Cloudinary PDFని మన సర్వర్ నుంచి inlineగా స్ట్రీమ్ చేస్తాం.
// // // //    Browsersలో “refused to connect / x-frame-options” type సమస్యలు దాదాపు నివారిస్తాం. */
// // // // app.get('/proxy/pdf', async (req, res) => {
// // // //   try {
// // // //     const raw = req.query.url;
// // // //     if (!raw) return res.status(400).send('Missing url');

// // // //     let u;
// // // //     try { u = new URL(raw); } catch { return res.status(400).send('Bad url'); }

// // // //     const allowedHosts = (process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com')
// // // //       .split(',')
// // // //       .map(h => h.trim().toLowerCase())
// // // //       .filter(Boolean);

// // // //     if (u.protocol !== 'https:') return res.status(400).send('HTTPS only');
// // // //     if (!allowedHosts.includes(u.hostname.toLowerCase())) return res.status(400).send('Host not allowed');
// // // //     if (!u.pathname.toLowerCase().endsWith('.pdf')) return res.status(400).send('PDF only');

// // // //     // Node 18+ లో global fetch ఉంటుంది; లేకపోతే node-fetch fallback వాడుతాం
// // // //     let fetchFn = global.fetch;
// // // //     if (typeof fetchFn !== 'function') {
// // // //       try {
// // // //         fetchFn = (await import('node-fetch')).default;
// // // //       } catch {
// // // //         return res.status(500).send('fetch not available (install node-fetch@3)');
// // // //       }
// // // //     }

// // // //     const upstream = await fetchFn(u.toString());
// // // //     if (!upstream.ok) return res.status(upstream.status).send('Upstream error');

// // // //     const fname = path.basename(u.pathname) || 'file.pdf';
// // // //     res.setHeader('Content-Type', 'application/pdf');
// // // //     res.setHeader('Content-Disposition', `inline; filename="${fname}"`);
// // // //     res.setHeader('Cache-Control', 'public, max-age=86400');

// // // //     if (upstream.body) {
// // // //       // web stream → Node Readable (Node 18+ కి fromWeb ఉంటుంది)
// // // //       if (Readable.fromWeb) {
// // // //         Readable.fromWeb(upstream.body).pipe(res);
// // // //       } else if (typeof upstream.body.pipe === 'function') {
// // // //         upstream.body.pipe(res);
// // // //       } else {
// // // //         const buf = Buffer.from(await upstream.arrayBuffer());
// // // //         res.end(buf);
// // // //       }
// // // //     } else {
// // // //       const buf = Buffer.from(await upstream.arrayBuffer());
// // // //       res.end(buf);
// // // //     }
// // // //   } catch (e) {
// // // //     console.error('PDF proxy error:', e);
// // // //     res.status(500).send('Proxy failed');
// // // //   }
// // // // });

// // // // app.listen(PORT, () => {
// // // //   console.log(`🚀 Server running on port ${PORT}`);
// // // // });

// // // /* ---------------- PDF Proxy (for iframe-safe PDF preview) ---------------- */


// // // const path = require('path');
// // // const { Readable } = require('stream');

// // // app.get('/proxy/pdf', async (req, res) => {
// // //   try {
// // //     const raw = req.query.url;
// // //     if (!raw) return res.status(400).send('Missing url');

// // //     // Validate URL + allow-list
// // //     let u;
// // //     try { u = new URL(raw); } catch { return res.status(400).send('Bad url'); }

// // //     const allowedHosts = (process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com')
// // //       .split(',')
// // //       .map(h => h.trim().toLowerCase())
// // //       .filter(Boolean);

// // //     if (u.protocol !== 'https:') return res.status(400).send('HTTPS only');
// // //     if (!allowedHosts.includes(u.hostname.toLowerCase())) return res.status(400).send('Host not allowed');
// // //     if (!u.pathname.toLowerCase().endsWith('.pdf')) return res.status(400).send('PDF only');

// // //     // fetch (Node 18+: global; else node-fetch fallback)
// // //     let fetchFn = global.fetch;
// // //     if (typeof fetchFn !== 'function') {
// // //       try {
// // //         fetchFn = (await import('node-fetch')).default;
// // //       } catch {
// // //         return res.status(500).send('fetch not available (install node-fetch@3)');
// // //       }
// // //     }

// // //     // Forward important headers (Range, UA) — PDF viewers partial content కోరుతాయి
// // //     const fHeaders = {};
// // //     if (req.headers['range']) fHeaders['range'] = req.headers['range'];
// // //     fHeaders['user-agent'] = req.headers['user-agent'] || 'BibleMiningPDFProxy/1.0';

// // //     const upstream = await fetchFn(u.toString(), {
// // //       method: 'GET',
// // //       headers: fHeaders,
// // //       redirect: 'follow',
// // //     });

// // //     if (!upstream.ok) {
// // //       // డయగ్నోస్‌కి exact status/text ని చూపిద్దాం
// // //       let body = '';
// // //       try { body = await upstream.text(); } catch {}
// // //       return res
// // //         .status(upstream.status)
// // //         .send(`Upstream ${upstream.status} ${upstream.statusText}\n${body}`.trim());
// // //     }

// // //     // Upstream headers → viewerకి సరైనవి పాస్ చేయండి
// // //     const fname = path.basename(u.pathname) || 'file.pdf';
// // //     const ct = (upstream.headers.get('content-type') || '').toLowerCase().includes('pdf')
// // //       ? upstream.headers.get('content-type')
// // //       : 'application/pdf';
// // //     const cl = upstream.headers.get('content-length');
// // //     const ar = upstream.headers.get('accept-ranges');
// // //     const et = upstream.headers.get('etag');
// // //     const lm = upstream.headers.get('last-modified');
// // //     const cc = upstream.headers.get('cache-control');

// // //     res.status(upstream.status); // 200/206 వంటివి preserve
// // //     res.setHeader('Content-Type', ct || 'application/pdf');
// // //     res.setHeader('Content-Disposition', `inline; filename="${fname}"`);
// // //     if (cl) res.setHeader('Content-Length', cl);
// // //     if (ar) res.setHeader('Accept-Ranges', ar);
// // //     if (et) res.setHeader('ETag', et);
// // //     if (lm) res.setHeader('Last-Modified', lm);
// // //     res.setHeader('Cache-Control', cc || 'public, max-age=86400');

// // //     // Stream body
// // //     if (upstream.body) {
// // //       if (Readable.fromWeb) {
// // //         Readable.fromWeb(upstream.body).pipe(res);
// // //       } else if (typeof upstream.body.pipe === 'function') {
// // //         upstream.body.pipe(res);
// // //       } else {
// // //         const buf = Buffer.from(await upstream.arrayBuffer());
// // //         res.end(buf);
// // //       }
// // //     } else {
// // //       const buf = Buffer.from(await upstream.arrayBuffer());
// // //       res.end(buf);
// // //     }
// // //   } catch (e) {
// // //     console.error('PDF proxy error:', e);
// // //     res.status(500).send('Proxy failed');
// // //   }
// // // });

// // // ---------------- PDF Proxy (for iframe-safe PDF preview) ----------------
// // app.get('/proxy/pdf', async (req, res) => {
// //   try {
// //     const raw = req.query.url;
// //     if (!raw) return res.status(400).send('Missing url');

// //     // Validate URL + allow-list
// //     let u;
// //     try { u = new URL(raw); } catch { return res.status(400).send('Bad url'); }

// //     const allowedHosts = (process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com')
// //       .split(',')
// //       .map(h => h.trim().toLowerCase())
// //       .filter(Boolean);

// //     if (u.protocol !== 'https:') return res.status(400).send('HTTPS only');
// //     if (!allowedHosts.includes(u.hostname.toLowerCase())) return res.status(400).send('Host not allowed');
// //     if (!u.pathname.toLowerCase().endsWith('.pdf')) return res.status(400).send('PDF only');

// //     // fetch (Node 18+: global; else node-fetch fallback via dynamic import)
// //     let fetchFn = typeof fetch === 'function' ? fetch : null;
// //     if (!fetchFn) {
// //       try {
// //         fetchFn = (await import('node-fetch')).default;
// //       } catch {
// //         return res.status(500).send('fetch not available (install node-fetch@3)');
// //       }
// //     }

// //     // Forward headers needed by PDF viewers (Range / revalidation)
// //     const fHeaders = {};
// //     if (req.headers.range) fHeaders.range = req.headers.range;
// //     if (req.headers['if-none-match']) fHeaders['if-none-match'] = req.headers['if-none-match'];
// //     if (req.headers['if-modified-since']) fHeaders['if-modified-since'] = req.headers['if-modified-since'];
// //     fHeaders['user-agent'] = req.headers['user-agent'] || 'BibleMiningPDFProxy/1.0';
// //     fHeaders['accept'] = req.headers['accept'] || 'application/pdf';

// //     // Optional timeout (prevents hanging)
// //     let controller, signal;
// //     if (typeof AbortController !== 'undefined') {
// //       controller = new AbortController();
// //       signal = controller.signal;
// //       setTimeout(() => controller.abort(), 20000); // 20s
// //     }

// //     const upstream = await fetchFn(u.toString(), {
// //       method: 'GET',
// //       headers: fHeaders,
// //       redirect: 'follow',
// //       signal,
// //     });

// //     if (!upstream.ok) {
// //       let body = '';
// //       try { body = await upstream.text(); } catch {}
// //       return res
// //         .status(upstream.status)
// //         .send(`Upstream ${upstream.status} ${upstream.statusText}\n${body}`.trim());
// //     }

// //     // Copy essential headers for proper inline PDF viewing
// //     const fname = path.basename(u.pathname) || 'file.pdf';
// //     const upstreamCT = upstream.headers.get('content-type') || '';
// //     const ct = upstreamCT.toLowerCase().includes('pdf') ? upstreamCT : 'application/pdf';
// //     const cl = upstream.headers.get('content-length');
// //     const ar = upstream.headers.get('accept-ranges');
// //     const et = upstream.headers.get('etag');
// //     const lm = upstream.headers.get('last-modified');
// //     const cc = upstream.headers.get('cache-control');
// //     const cr = upstream.headers.get('content-range');

// //     res.status(upstream.status); // preserve 200/206/304
// //     res.setHeader('Content-Type', ct);
// //     res.setHeader('Content-Disposition', `inline; filename="${fname}"`);
// //     if (cl) res.setHeader('Content-Length', cl);
// //     if (ar) res.setHeader('Accept-Ranges', ar);
// //     if (et) res.setHeader('ETag', et);
// //     if (lm) res.setHeader('Last-Modified', lm);
// //     if (cr) res.setHeader('Content-Range', cr);
// //     res.setHeader('Cache-Control', cc || 'public, max-age=86400');

// //     // Stream body back to client
// //     if (upstream.body) {
// //       if (Readable.fromWeb) {
// //         Readable.fromWeb(upstream.body).pipe(res);
// //       } else if (typeof upstream.body.pipe === 'function') {
// //         upstream.body.pipe(res);
// //       } else {
// //         const buf = Buffer.from(await upstream.arrayBuffer());
// //         res.end(buf);
// //       }
// //     } else {
// //       const buf = Buffer.from(await upstream.arrayBuffer());
// //       res.end(buf);
// //     }
// //   } catch (e) {
// //     console.error('PDF proxy error:', e);
// //     // If aborted by timeout
// //     if (e && e.name === 'AbortError') return res.status(504).send('Upstream timeout');
// //     res.status(500).send('Proxy failed');
// //   }
// // });

// // backend/server.js
// // const path = require('path');
// // const fs = require('fs');
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const { Readable } = require('stream');

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // /* ---------------- Express base ---------------- */
// // app.set('trust proxy', true);
// // app.use(express.json());

// // /* ---------------- CORS ---------------- */
// // const rawOrigins = process.env.CORS_ORIGIN || '*';
// // const allowList = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);

// // const corsOptions = {
// //   origin: allowList.includes('*')
// //     ? true
// //     : function (origin, cb) {
// //         if (!origin) return cb(null, true);
// //         cb(null, allowList.includes(origin));
// //       },
// //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// //   credentials: true,
// // };
// // app.use(cors(corsOptions));

// // /* ---------------- Uploads bootstrap ---------------- */
// // const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// // ['', 'songs', 'sermons'].forEach((sub) => {
// //   try {
// //     fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true });
// //   } catch {}
// // });
// // app.use('/uploads', express.static(UPLOAD_ROOT));

// // /* ---------------- Mongo ---------------- */
// // const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// // mongoose
// //   .connect(mongoUri)
// //   .then(() =>
// //     console.log(
// //       '✅ MongoDB connected:',
// //       mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'
// //     )
// //   )
// //   .catch((err) => {
// //     console.error('❌ MongoDB connection error:', err?.message || err);
// //     process.exit(1);
// //   });

// // /* ---------------- Routes ---------------- */
// // const songsRouter = require('./routes/Songs');
// // app.use('/api/songs', songsRouter);

// // const sermonsRouter = require('./routes/sermons');
// // app.use('/api/sermons', sermonsRouter);

// // const galleryRouter = require('./routes/gallery');
// // app.use('/api/gallery', galleryRouter);

// // const videosRouter = require('./routes/videos');
// // app.use('/api/videos', videosRouter);

// // const contactRouter = require('./routes/contact');
// // app.use('/api/contact', contactRouter);

// // const homepageRouter = require('./routes/homepage');
// // app.use('/api/homepage', homepageRouter);

// // const logoRouter = require('./routes/logo');
// // app.use('/api/logo', logoRouter);

// // const blogRouter = require('./routes/blog');
// // app.use('/api/blog', blogRouter);

// // const aboutRouter = require('./routes/about');
// // app.use('/api/about', aboutRouter);

// // const authRouter = require('./routes/auth');
// // app.use('/api/auth', authRouter);

// // /* ---------------- Health ---------------- */
// // app.get('/health', (_req, res) => {
// //   res.json({ ok: true, uptime: process.uptime() });
// // });

// // /* ---------------- DEBUG (uploads on disk) ---------------- */
// // app.get('/debug/uploads/songs', (req, res) => {
// //   try {
// //     const dir = path.join(__dirname, 'uploads', 'songs');
// //     const exists = fs.existsSync(dir);
// //     const files = exists ? fs.readdirSync(dir) : [];
// //     res.json({ dir, exists, files });
// //   } catch (e) {
// //     res.status(500).json({ error: String(e) });
// //   }
// // });

// // /* ---------------- DEBUG (Cloudinary env check) ---------------- */
// // app.get('/debug/cloudinary', (req, res) => {
// //   res.json({
// //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
// //     api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
// //     api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
// //     folder_songs: process.env.CLOUDINARY_FOLDER || 'default',
// //     folder_sermons:
// //       process.env.CLOUDINARY_FOLDER_SERMONS ||
// //       process.env.CLOUDINARY_SERMONS_FOLDER ||
// //       'bible-mining/sermons',
// //     pdf_proxy_allowed_hosts: process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com',
// //   });
// // });

// // /* ---------------- PDF Proxy (optional; PdfJsModal uses direct first) ---------------- */
// // app.get('/proxy/pdf', async (req, res) => {
// //   try {
// //     const raw = req.query.url;
// //     if (!raw) return res.status(400).send('Missing url');

// //     let u;
// //     try {
// //       u = new URL(raw);
// //     } catch {
// //       return res.status(400).send('Bad url');
// //     }

// //     const allowedHosts = (process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com')
// //       .split(',')
// //       .map((h) => h.trim().toLowerCase())
// //       .filter(Boolean);

// //     if (u.protocol !== 'https:') return res.status(400).send('HTTPS only');
// //     if (!allowedHosts.includes(u.hostname.toLowerCase()))
// //       return res.status(400).send('Host not allowed');
// //     if (!u.pathname.toLowerCase().endsWith('.pdf')) return res.status(400).send('PDF only');

// //     let fetchFn = typeof fetch === 'function' ? fetch : null;
// //     if (!fetchFn) {
// //       try {
// //         fetchFn = (await import('node-fetch')).default;
// //       } catch {
// //         return res.status(500).send('fetch not available (install node-fetch@3)');
// //       }
// //     }

// //     const fHeaders = {};
// //     if (req.headers.range) fHeaders.range = req.headers.range;
// //     if (req.headers['if-none-match']) fHeaders['if-none-match'] = req.headers['if-none-match'];
// //     if (req.headers['if-modified-since'])
// //       fHeaders['if-modified-since'] = req.headers['if-modified-since'];
// //     fHeaders['user-agent'] = req.headers['user-agent'] || 'BibleMiningPDFProxy/1.0';
// //     fHeaders['accept'] = req.headers['accept'] || 'application/pdf';

// //     let controller, signal;
// //     if (typeof AbortController !== 'undefined') {
// //       controller = new AbortController();
// //       signal = controller.signal;
// //       setTimeout(() => controller.abort(), 20000);
// //     }

// //     const upstream = await fetchFn(u.toString(), {
// //       method: 'GET',
// //       headers: fHeaders,
// //       redirect: 'follow',
// //       signal,
// //     });

// //     if (!upstream.ok) {
// //       let body = '';
// //       try {
// //         body = await upstream.text();
// //       } catch {}
// //       return res
// //         .status(upstream.status)
// //         .send(`Upstream ${upstream.status} ${upstream.statusText}\n${body}`.trim());
// //     }

// //     const fname = path.basename(u.pathname) || 'file.pdf';
// //     const upstreamCT = upstream.headers.get('content-type') || '';
// //     const ct = upstreamCT.toLowerCase().includes('pdf') ? upstreamCT : 'application/pdf';
// //     const cl = upstream.headers.get('content-length');
// //     const ar = upstream.headers.get('accept-ranges');
// //     const et = upstream.headers.get('etag');
// //     const lm = upstream.headers.get('last-modified');
// //     const cc = upstream.headers.get('cache-control');
// //     const cr = upstream.headers.get('content-range');

// //     res.status(upstream.status);
// //     res.setHeader('Content-Type', ct);
// //     res.setHeader('Content-Disposition', `inline; filename="${fname}"`);
// //     if (cl) res.setHeader('Content-Length', cl);
// //     if (ar) res.setHeader('Accept-Ranges', ar);
// //     if (et) res.setHeader('ETag', et);
// //     if (lm) res.setHeader('Last-Modified', lm);
// //     if (cr) res.setHeader('Content-Range', cr);
// //     res.setHeader('Cache-Control', cc || 'public, max-age=86400');

// //     if (upstream.body) {
// //       if (Readable.fromWeb) {
// //         Readable.fromWeb(upstream.body).pipe(res);
// //       } else if (typeof upstream.body.pipe === 'function') {
// //         upstream.body.pipe(res);
// //       } else {
// //         const buf = Buffer.from(await upstream.arrayBuffer());
// //         res.end(buf);
// //       }
// //     } else {
// //       const buf = Buffer.from(await upstream.arrayBuffer());
// //       res.end(buf);
// //     }
// //   } catch (e) {
// //     console.error('PDF proxy error:', e);
// //     if (e && e.name === 'AbortError') return res.status(504).send('Upstream timeout');
// //     res.status(500).send('Proxy failed');
// //   }
// // });

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// // });

// // server.js
// const path = require('path');
// const fs = require('fs');
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { Readable } = require('stream');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// /* ---------------- Express base ---------------- */
// app.set('trust proxy', true);
// app.use(express.json());

// /* ---------------- CORS ---------------- */
// // Netlify/Local/others comma-separated origins
// const rawOrigins = process.env.CORS_ORIGIN || '*';
// const allowList = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);

// const corsOptions = {
//   origin: allowList.includes('*')
//     ? true
//     : function (origin, cb) {
//         if (!origin) return cb(null, true); // SSR/no-origin
//         cb(null, allowList.includes(origin));
//       },
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
//   credentials: true,
//   allowedHeaders: [
//     'Origin','X-Requested-With','Content-Type','Accept',
//     'Range','If-None-Match','If-Modified-Since','Authorization'
//   ],
// };
// // Preflight + normal
// app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));

// // PDF viewers read these headers; expose them
// app.use((req, res, next) => {
//   res.setHeader(
//     'Access-Control-Expose-Headers',
//     'Content-Length,Content-Range,Accept-Ranges,Content-Type,ETag,Last-Modified'
//   );
//   next();
// });

// /* ---------------- Uploads bootstrap ---------------- */
// const UPLOAD_ROOT = path.join(__dirname, 'uploads');
// ['', 'songs', 'sermons'].forEach((sub) => {
//   try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
// });
// app.use('/uploads', express.static(UPLOAD_ROOT));

// /* ---------------- Mongo ---------------- */
// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
// mongoose
//   .connect(mongoUri)
//   .then(() =>
//     console.log(
//       '✅ MongoDB connected:',
//       mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'
//     )
//   )
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err?.message || err);
//     process.exit(1);
//   });

// /* ---------------- Routes ---------------- */
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
// app.get('/debug/cloudinary', (req, res) => {
//   res.json({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
//     api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
//     api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
//     folder_songs: process.env.CLOUDINARY_FOLDER || 'default',
//     folder_sermons:
//       process.env.CLOUDINARY_FOLDER_SERMONS ||
//       process.env.CLOUDINARY_SERMONS_FOLDER ||
//       'bible-mining/sermons',
//     pdf_proxy_allowed_hosts: process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com',
//   });
// });

// /* ---------------- PDF Proxy (GET/HEAD) ----------------
//    – Cloudinary PDFs‌ని iframe/modal లో చూపించడానికి అవసరమైనప్పుడు ఉపయోగించవచ్చు
//    – Direct URL ముందు ట్రై చేయాలి; ఫెయిల్ అయితే మాత్రమే దీనిపై ఫాల్‌బ్యాక్
// -------------------------------------------------------- */
// app.all('/proxy/pdf', async (req, res) => {
//   try {
//     const raw = req.query.url;
//     if (!raw) return res.status(400).send('Missing url');

//     let u;
//     try { u = new URL(raw); } catch { return res.status(400).send('Bad url'); }

//     const allowedHosts = (process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com')
//       .split(',').map((h) => h.trim().toLowerCase()).filter(Boolean);

//     if (u.protocol !== 'https:') return res.status(400).send('HTTPS only');
//     if (!allowedHosts.includes(u.hostname.toLowerCase()))
//       return res.status(400).send('Host not allowed');
//     if (!u.pathname.toLowerCase().endsWith('.pdf'))
//       return res.status(400).send('PDF only');

//     // Common mistake guard: PDFs ‘image/upload’గా ఉంటే బ్రౌజర్ లోడ్ అవ్వదు
//     if (u.pathname.includes('/image/upload/')) {
//       return res
//         .status(422)
//         .send('Cloudinary path shows image/upload for a .pdf. Upload PDFs with resource_type="raw".');
//     }

//     let fetchFn = typeof fetch === 'function' ? fetch : null;
//     if (!fetchFn) {
//       try { fetchFn = (await import('node-fetch')).default; }
//       catch { return res.status(500).send('fetch not available (install node-fetch@3)'); }
//     }

//     // Forward useful headers (Range, conditional)
//     const fHeaders = {};
//     if (req.headers.range) fHeaders.range = req.headers.range;
//     if (req.headers['if-none-match']) fHeaders['if-none-match'] = req.headers['if-none-match'];
//     if (req.headers['if-modified-since'])
//       fHeaders['if-modified-since'] = req.headers['if-modified-since'];
//     fHeaders['user-agent'] = req.headers['user-agent'] || 'BibleMiningPDFProxy/1.0';
//     fHeaders['accept'] = req.headers['accept'] || 'application/pdf';

//     // Timeout (20s)
//     let controller, signal;
//     if (typeof AbortController !== 'undefined') {
//       controller = new AbortController();
//       signal = controller.signal;
//       setTimeout(() => controller.abort(), 20000);
//     }

//     const method = req.method === 'HEAD' ? 'HEAD' : 'GET';
//     const upstream = await fetchFn(u.toString(), {
//       method,
//       headers: fHeaders,
//       redirect: 'follow',
//       signal,
//     });

//     if (!upstream.ok) {
//       let body = '';
//       try { body = await upstream.text(); } catch {}
//       return res
//         .status(upstream.status)
//         .send(`Upstream ${upstream.status} ${upstream.statusText}\n${body}`.trim());
//     }

//     const fname = path.basename(u.pathname) || 'file.pdf';
//     const upstreamCT = upstream.headers.get('content-type') || '';
//     const ct = upstreamCT.toLowerCase().includes('pdf') ? upstreamCT : 'application/pdf';
//     const cl = upstream.headers.get('content-length');
//     const ar = upstream.headers.get('accept-ranges');
//     const et = upstream.headers.get('etag');
//     const lm = upstream.headers.get('last-modified');
//     const cc = upstream.headers.get('cache-control');
//     const cr = upstream.headers.get('content-range');

//     res.status(upstream.status);
//     res.setHeader('Content-Type', ct);
//     res.setHeader('Content-Disposition', `inline; filename="${fname}"`);
//     if (cl) res.setHeader('Content-Length', cl);
//     if (ar) res.setHeader('Accept-Ranges', ar);
//     if (et) res.setHeader('ETag', et);
//     if (lm) res.setHeader('Last-Modified', lm);
//     if (cr) res.setHeader('Content-Range', cr);
//     res.setHeader('Cache-Control', cc || 'public, max-age=86400');

//     if (method === 'HEAD') {
//       return res.end();
//     }

//     // Stream body
//     if (upstream.body) {
//       if (Readable.fromWeb) {
//         Readable.fromWeb(upstream.body).pipe(res);
//       } else if (typeof upstream.body.pipe === 'function') {
//         upstream.body.pipe(res);
//       } else {
//         const buf = Buffer.from(await upstream.arrayBuffer());
//         res.end(buf);
//       }
//     } else {
//       const buf = Buffer.from(await upstream.arrayBuffer());
//       res.end(buf);
//     }
//   } catch (e) {
//     console.error('PDF proxy error:', e);
//     if (e && e.name === 'AbortError') return res.status(504).send('Upstream timeout');
//     res.status(500).send('Proxy failed');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// server.js (fixed)
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Readable } = require('stream');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- Express base ---------------- */
app.set('trust proxy', true);
app.use(express.json());

/* ---------------- CORS ---------------- */
const rawOrigins = process.env.CORS_ORIGIN || '*';
const allowList = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);

const corsOptions = {
  origin: allowList.includes('*')
    ? true
    : function (origin, cb) {
        if (!origin) return cb(null, true); // SSR/no-origin
        cb(null, allowList.includes(origin));
      },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  credentials: true,
  allowedHeaders: [
    'Origin','X-Requested-With','Content-Type','Accept',
    'Range','If-None-Match','If-Modified-Since','Authorization'
  ],
};

// Normal requests
app.use(cors(corsOptions));
// ✅ Preflight for all routes — Express v5-safe (regex instead of "*")
app.options(/.*/, cors(corsOptions));

// Expose headers useful for PDF viewers
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Expose-Headers',
    'Content-Length,Content-Range,Accept-Ranges,Content-Type,ETag,Last-Modified'
  );
  next();
});

/* ---------------- Uploads bootstrap ---------------- */
const UPLOAD_ROOT = path.join(__dirname, 'uploads');
['', 'songs', 'sermons'].forEach((sub) => {
  try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
});
app.use('/uploads', express.static(UPLOAD_ROOT));

/* ---------------- Mongo ---------------- */
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblemining';
mongoose
  .connect(mongoUri)
  .then(() =>
    console.log(
      '✅ MongoDB connected:',
      mongoUri.includes('mongodb+srv://') ? 'Atlas' : 'Local'
    )
  )
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err?.message || err);
    process.exit(1);
  });

/* ---------------- Routes ---------------- */
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
app.get('/debug/cloudinary', (req, res) => {
  res.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
    api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
    folder_songs: process.env.CLOUDINARY_FOLDER || 'default',
    folder_sermons:
      process.env.CLOUDINARY_FOLDER_SERMONS ||
      process.env.CLOUDINARY_SERMONS_FOLDER ||
      'bible-mining/sermons',
    pdf_proxy_allowed_hosts: process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com',
  });
});

/* ---------------- PDF Proxy (GET/HEAD) ---------------- */
app.all('/proxy/pdf', async (req, res) => {
  try {
    const raw = req.query.url;
    if (!raw) return res.status(400).send('Missing url');

    let u;
    try { u = new URL(raw); } catch { return res.status(400).send('Bad url'); }

    const allowedHosts = (process.env.PDF_PROXY_ALLOWED_HOSTS || 'res.cloudinary.com')
      .split(',').map((h) => h.trim().toLowerCase()).filter(Boolean);

    if (u.protocol !== 'https:') return res.status(400).send('HTTPS only');
    if (!allowedHosts.includes(u.hostname.toLowerCase()))
      return res.status(400).send('Host not allowed');
    if (!u.pathname.toLowerCase().endsWith('.pdf'))
      return res.status(400).send('PDF only');

    // Guard: wrong Cloudinary path
    if (u.pathname.includes('/image/upload/')) {
      return res
        .status(422)
        .send('Cloudinary path shows image/upload for a .pdf. Upload PDFs with resource_type="raw".');
    }

    let fetchFn = typeof fetch === 'function' ? fetch : null;
    if (!fetchFn) {
      try { fetchFn = (await import('node-fetch')).default; }
      catch { return res.status(500).send('fetch not available (install node-fetch@3)'); }
    }

    const fHeaders = {};
    if (req.headers.range) fHeaders.range = req.headers.range;
    if (req.headers['if-none-match']) fHeaders['if-none-match'] = req.headers['if-none-match'];
    if (req.headers['if-modified-since'])
      fHeaders['if-modified-since'] = req.headers['if-modified-since'];
    fHeaders['user-agent'] = req.headers['user-agent'] || 'BibleMiningPDFProxy/1.0';
    fHeaders['accept'] = req.headers['accept'] || 'application/pdf';

    let controller, signal;
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      signal = controller.signal;
      setTimeout(() => controller.abort(), 20000);
    }

    const method = req.method === 'HEAD' ? 'HEAD' : 'GET';
    const upstream = await fetchFn(u.toString(), {
      method,
      headers: fHeaders,
      redirect: 'follow',
      signal,
    });

    if (!upstream.ok) {
      let body = '';
      try { body = await upstream.text(); } catch {}
      return res
        .status(upstream.status)
        .send(`Upstream ${upstream.status} ${upstream.statusText}\n${body}`.trim());
    }

    const fname = path.basename(u.pathname) || 'file.pdf';
    const upstreamCT = upstream.headers.get('content-type') || '';
    const ct = upstreamCT.toLowerCase().includes('pdf') ? upstreamCT : 'application/pdf';
    const cl = upstream.headers.get('content-length');
    const ar = upstream.headers.get('accept-ranges');
    const et = upstream.headers.get('etag');
    const lm = upstream.headers.get('last-modified');
    const cc = upstream.headers.get('cache-control');
    const cr = upstream.headers.get('content-range');

    res.status(upstream.status);
    res.setHeader('Content-Type', ct);
    res.setHeader('Content-Disposition', `inline; filename="${fname}"`);
    if (cl) res.setHeader('Content-Length', cl);
    if (ar) res.setHeader('Accept-Ranges', ar);
    if (et) res.setHeader('ETag', et);
    if (lm) res.setHeader('Last-Modified', lm);
    if (cr) res.setHeader('Content-Range', cr);
    res.setHeader('Cache-Control', cc || 'public, max-age=86400');

    if (method === 'HEAD') return res.end();

    if (upstream.body) {
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
    if (e && e.name === 'AbortError') return res.status(504).send('Upstream timeout');
    res.status(500).send('Proxy failed');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
