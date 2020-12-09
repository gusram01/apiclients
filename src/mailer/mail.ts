import nodeMailer from 'nodemailer';

export const transporter = nodeMailer.createTransport({
  host: process.env.MAIL_URL,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify().then(() => console.log('Mailer ready'));
