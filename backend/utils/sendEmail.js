const nodemailer = require("nodemailer");
const User = require("../models/User");
const sendEmail = async (
  email,
  subject,
  message
) => {

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  const transporter =
    nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 587,

      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

    });

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject,

    text: message,

  });

};

module.exports = sendEmail;