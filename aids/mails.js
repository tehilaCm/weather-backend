const nodemailer = require("nodemailer");

const sendEmail = (email) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tehilahchasidim@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: "tehilahchasidim@gmail.com",
    to: email,
    subject: "ברוכים הבאים",
    text: ";-) Check out the weathr",
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) reject(error);
      else resolve(`Email sent: ${info.response}`);
    });
  });
};

module.exports = { sendEmail };
