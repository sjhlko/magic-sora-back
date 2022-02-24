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
   * node mailer
   */
  mailerUser: process.env.NODEMAILER_USER,
  mailerPW: process.env.NODEMAILER_PW,

  /**
   * api config
   */
  api: {
    prefix: '/api',
  },
};
