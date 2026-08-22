
require('dotenv').config();

const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post('/api/message', async (req, res) => {
  const name = (req.body.name || '').trim();
  const text = (req.body.message || '').trim();

  if (!name || !text) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"Glow & Grace Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: process.env.GMAIL_USER,
      subject: `New website message from ${name}`,
      text: `${text}\n\n— ${name}`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to send message email:', err);
    res.status(500).json({ error: 'Could not send message right now.' });
  }
});

app.listen(PORT, () => {
  console.log(`Glow & Grace server running at http://localhost:${PORT}`);
});
