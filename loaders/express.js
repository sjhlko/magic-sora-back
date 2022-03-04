import express from 'express';
import cors from 'cors';
import route from '../api/index.js';
import config from '../config/index.js';

export default app => {
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(config.api.prefix, route());
};
