import nodemailer from 'nodemailer';
import config from '../config/index.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'stmp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: config.mailerUser,
    pass: config.mailerPW,
  },
});

export { transporter };
