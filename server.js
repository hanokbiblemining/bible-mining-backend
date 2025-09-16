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

const path = require('path');
const fs = require('fs');                     // [CHANGE] uploads ఫోల్డర్లు సృష్టించడానికి
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- CORS ---------------- */
// [WHY] Netlify + Localhost రెండూ నుంచి కాల్స్ రావాలి
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  credentials: true,
}));

app.use(express.json());

/* ---------------- Uploads bootstrap ---------------- */
// [CHANGE] Render లో ENOENT రాకుండా uploads రూట్ + songs సబ్‌ఫోల్డర్ ని ఆటోగా సృష్టిస్తున్నాం
const UPLOAD_ROOT = path.join(__dirname, 'uploads');
['', 'songs' /* తరువాత gallery, logo, homepage, sermons వంటివి add చేస్కోవచ్చు */]
  .forEach((sub) => {
    try { fs.mkdirSync(path.join(UPLOAD_ROOT, sub), { recursive: true }); } catch {}
  });

// [CHANGE] absolute path తో static serve (CWD issues నివారించడానికి)
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
// [CHANGE] Linux/Render లో case-sensitive కాబట్టి Songs.js ని 'Songs' గా require చేయాలి
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
