const express = require('express');
const router = express.Router();

// భద్రత కోసం, ఈ వివరాలను environment variables లో ఉంచాలి.
const ADMIN_USER = 'biblemining'; // మీ యూజర్‌నేమ్
const ADMIN_PASS = 'BibleMining@777'; // మీ పాస్‌వర్డ్

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'తప్పు యూజర్‌నేమ్ లేదా పాస్‌వర్డ్.' });
  }
});

module.exports = router;