const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, message } = req.body || {};
  const cleanName = (name || '').trim();
  const cleanMessage = (message || '').trim();

  if (!cleanName || !cleanMessage) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"Glow & Grace Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: process.env.GMAIL_USER,
      subject: `New website message from ${cleanName}`,
      text: `${cleanMessage}\n\n— ${cleanName}`,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to send message email:', err);
    res.status(500).json({ error: 'Could not send message right now.' });
  }
};
