import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

export default {
  port: parseInt(process.env.PORT, 10),
  clientURL: process.env.CLIENT_URL,
  databaseURL: process.env.SQL_URI,
  jwtSecret: process.env.JWT_SECRET,
  hashSecret: process.env.SECRET_KEY,

  oauthUser: process.env.OAUTH_USER,
  oauthClient: process.env.OAUTH_CLIENT_ID,
  oauthSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthRedirect: process.env.OAUTH_REDIRECT_URI,
  oauthRefresh: process.env.OAUTH_REFRESH_TOKEN,

  api: {
    prefix: '/api',
  },
};
