const nodemailer = require("nodemailer");

const forgotPassword = (email, header , token) => {
  const transporter = nodemailer.createTransport(
    "smtps://thepsa.site%40@gmail.com:Tuan12101991@smtp.gmail.com"
  );
  const client_URL = header;
  const output = `
    <h2>Xin hãy ấn vào đường dẫn bên dưới đễ đi đến trang đặt lại mật khẩu</h2>
    <a href=${client_URL}/${token}> Đặt lại mật khẩu của bạn </a>
    <p>Để vảo lại tài khoản của bạn</p>

    <h2>Xin cảm ơn,</h2>
    <h2>The PSA team</h2>
    `;
  const mailOption = {
    from: '"The PSA" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Forgot password", // Subject line
    text: `Please click link below to change your password
    ${client_URL}/${token}`,
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
