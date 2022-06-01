import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import { google } from 'googleapis';
import config from '../config/index.js';

const createTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    config.oauthClient,
    config.oauthSecret,
    config.oauthRedirect,
  );

  oauth2Client.setCredentials({
    refresh_token: config.oauthRefresh,
  });

  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'stmp.google.com',
    port: 587,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: config.oauthUser,
      clientId: config.oauthClient,
      clientSecret: config.oauthSecret,
      refreshToken: config.oauthRefresh,
      accessToken: accessToken,
    },
  });
};

const sendMail = async (transporter, user, link) => {
  const __dirname = path.resolve('public');

  const data = await ejs.renderFile(__dirname + '/template.ejs', {
    name: user.nickname,
    link: link,
  });

  await transporter.sendMail({
    from: config.oauthUser,
    to: user.user_email,
    subject: '🔮 마법의 익명고동 비밀번호 재설정',
    html: data,
    attachments: [
      {
        filename: 'soraLogo.png',
        path: `${__dirname}/soraLogo.png`,
        cid: 'magicsora_logo',
      },
    ],
  });
};

export { createTransporter, sendMail };
