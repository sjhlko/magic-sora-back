import nodemailer from 'nodemailer';
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

  const transporter = nodemailer.createTransport({
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

  return transporter;
};

export { createTransporter };
