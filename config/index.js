import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

export default {
  // port 번호
  port: parseInt(process.env.PORT, 10),

  // DB
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  databaseURL: process.env.SQL_URI,
};
