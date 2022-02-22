import express from 'express';
import route from '../api/index.js';
import config from '../config/index.js';

export default app => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(config.api.prefix, route());
};
