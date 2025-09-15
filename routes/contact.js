// const express = require('express');
// const router = express.Router();
// const Contact = require('../models/Contact');
// const nodemailer = require('nodemailer');

// // మీ ఈమెయిల్ వివరాలను ఇక్కడ సెట్ చేయండి. భద్రత కోసం, మీరు environment variables ఉపయోగించడం మంచిది.
// // ప్రస్తుతానికి, మీరు మీ Gmail account మరియు App Password ను ఉపయోగించవచ్చు.
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // లేదా 'outlook', 'yahoo'
//   auth: {
//     user: 'bibleminingbyhanok', // మీ Gmail అడ్రస్
//     pass: 'lggv fgnv acam jcsp', // మీ App Password
//   }
// });

// // కాంటాక్ట్ వివరాలను పొందడానికి
// router.get('/', async (req, res) => {
//   try {
//     const contactInfo = await Contact.findOne();
//     res.json(contactInfo || {});
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // కాంటాక్ట్ వివరాలను అప్‌డేట్ చేయడానికి
// router.post('/', async (req, res) => {
//   try {
//     const { address, phone_number, email, youtube_link, facebook_link, instagram_link } = req.body;
//     let contactInfo = await Contact.findOne();
//     if (!contactInfo) {
//       contactInfo = new Contact({ address, phone_number, email, youtube_link, facebook_link, instagram_link });
//     } else {
//       contactInfo.address = address;
//       contactInfo.phone_number = phone_number;
//       contactInfo.email = email;
//       contactInfo.youtube_link = youtube_link;
//       contactInfo.facebook_link = facebook_link;
//       contactInfo.instagram_link = instagram_link;
//     }
//     const updatedInfo = await contactInfo.save();
//     res.status(201).json(updatedInfo);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // కొత్త రూట్: ఈమెయిల్‌ను పంపడానికి
// router.post('/send-email', async (req, res) => {
//   const { name, email, mobile, message } = req.body;

//   const mailOptions = {
//     from: email,
//     to: 'your_email@gmail.com', // మీరు ఈమెయిల్స్ అందుకోవాలనుకుంటున్న అడ్రస్
//     subject: `New message from ${name} on Bible Mining Website`,
//     html: `
//       <p><b>Name:</b> ${name}</p>
//       <p><b>Email:</b> ${email}</p>
//       <p><b>Mobile:</b> ${mobile}</p>
//       <p><b>Message:</b> ${message}</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Email sent successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error sending email.' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// మీ ఈమెయిల్ వివరాలను ఇక్కడ సెట్ చేయండి.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bibleminingbyhanok@gmail.com', // మీ Gmail అడ్రస్
    pass: 'lggv fgnv acam jcsp', // మీ App Password
  }
});

// కాంటాక్ట్ వివరాలను పొందడానికి
router.get('/', async (req, res) => {
  try {
    const contactInfo = await Contact.findOne();
    res.json(contactInfo || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// కాంటాక్ట్ వివరాలను అప్‌డేట్ చేయడానికి
router.post('/', async (req, res) => {
  try {
    const { address, phone_number, email, youtube_link, facebook_link, instagram_link } = req.body;
    let contactInfo = await Contact.findOne();
    if (!contactInfo) {
      contactInfo = new Contact({ address, phone_number, email, youtube_link, facebook_link, instagram_link });
    } else {
      contactInfo.address = address;
      contactInfo.phone_number = phone_number;
      contactInfo.email = email;
      contactInfo.youtube_link = youtube_link;
      contactInfo.facebook_link = facebook_link;
      contactInfo.instagram_link = instagram_link;
    }
    const updatedInfo = await contactInfo.save();
    res.status(201).json(updatedInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// కొత్త రూట్: ఈమెయిల్‌ను పంపడానికి
router.post('/send-email', async (req, res) => {
  const { name, email, mobile, message } = req.body;
  const yourEmail = 'bibleminingbyhanok@gmail.com'; // మీ Gmail అడ్రస్ ఇక్కడ ఇవ్వండి

  const mailOptions = {
    from: yourEmail, // ఈమెయిల్ మీ అడ్రస్ నుండే పంపబడుతుంది
    to: yourEmail, // ఈమెయిల్ మీ అడ్రస్ కే వస్తుంది
    replyTo: email, // మీరు రిప్లై కొట్టినప్పుడు సందర్శకుడికి వెళ్తుంది
    subject: `Bible Mining Website నుండి కొత్త సందేశం`,
    html: `
      <p><b>సందేశం పంపినవారు:</b> ${name}</p>
      <p><b>ఈమెయిల్:</b> ${email}</p>
      <p><b>మొబైల్:</b> ${mobile}</p>
      <p><b>సందేశం:</b> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'ఈమెయిల్ విజయవంతంగా పంపబడింది!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'ఈమెయిల్ పంపడంలో లోపం సంభవించింది.' });
  }
});

module.exports = router;