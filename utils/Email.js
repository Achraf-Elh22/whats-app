const nodemailer = require('nodemailer');
const pug = require('pug');

const {
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_AUTH_USER,
  MAILTRAP_AUTH_PASS,
  EMAIL_FROM,
  NODE_ENV,
} = require('../config/index');

module.exports = class Email {
  constructor(user, otpCode) {
    this.to = user.email;
    this.firstName = user.name || ' ';
    this.otpCode = otpCode;
    this.from = `ACHRAF ELHAMZAOUI <${EMAIL_FROM}>`;
  }

  createTransporter() {
    if (NODE_ENV === 'production') {
      // Production service
      return 1;
    }

    return nodemailer.createTransport({
      host: MAILTRAP_HOST,
      port: MAILTRAP_PORT,
      auth: {
        user: MAILTRAP_AUTH_USER,
        pass: MAILTRAP_AUTH_PASS,
      },
    });
  }

  async sendMail(template, subject) {
    // 1) Render HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      subject,
      firstName: this.firstName.split(' ')[0],
      otpCode: this.otpCode.split(''),
    });
    console.log(this.otpCode);
    // 2) Define Email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };
    // 3)create and send Email
    await this.createTransporter().sendMail(mailOptions);
  }
};
