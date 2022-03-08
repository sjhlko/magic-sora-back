import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import route from '../api/index.js';
import config from '../config/index.js';
import logger from './logger.js';

export default app => {
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  const combined =
    ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
  const morganFormat = process.env.NODE_ENV !== 'production' ? 'dev' : combined;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(morgan(morganFormat, { stream: logger.stream }));
  app.use(config.api.prefix, route());
};
