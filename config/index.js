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
   * api config
   */
  api: {
    prefix: '/api',
  },
};
