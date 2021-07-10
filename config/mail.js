const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const User = require("../model/User");

const forgotPassword = (email, user,header) => {
  const token = JWT.sign({ email }, process.env.SECRET, {
    expiresIn: 6048000,
  });
  user.emailToken = token;
  const transporter = nodemailer.createTransport(
    "smtps://thepsa.site%40@gmail.com:Tuan12101991@smtp.gmail.com"
  );
  const client_URL = header;
  const output = `
    <h2>Please click link below to change your password</h2>
    <p>${client_URL}/?token=${token}</p>
    `;
  const mailOption = {
    from: '"The PSA" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Forgot password", // Subject line
    text: `Please click link below to change your password
    ${client_URL}/?token=${token}`,
    html: output, // html body
  };
  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
    } else {
    }
  });
};

module.exports = {
  forgotPassword,
};
