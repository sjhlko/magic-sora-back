import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

export default {
  /**
   * port number
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * DB
   */
  databaseURL: process.env.SQL_URI,

  /**
   * JsonWebToken
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * password hash secret key
   */
  hashSecret: process.env.SECRET_KEY,

  /**
   * node mailer
   * google OAuth 2.0
   */
  oauthUser: process.env.OAUTH_USER,
  oauthClient: process.env.OAUTH_CLIENT_ID,
  oauthSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthRedirect: process.env.OAUTH_REDIRECT_URI,
  oauthRefresh: process.env.OAUTH_REFRESH_TOKEN,

  /**
   * api config
   */
  api: {
    prefix: '/api',
  },
};
