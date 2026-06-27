require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  try {
    console.log('EMAIL_USER=', process.env.EMAIL_USER);
    console.log('EMAIL_PASS=', process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'PHOENIX OTP test',
      text: 'This is a test email from the PHOENIX app.',
    });
    console.log('sent', info);
  } catch (err) {
    console.error('error', err);
  }
})();