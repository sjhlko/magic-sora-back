import express from 'express';
import config from './config/index.js';
import loaders from './loaders/index.js';
import logger from './loaders/logger.js';

async function startServer() {
  const app = express();

  loaders(app);

  app
    .listen(config.port, () => {
      logger.info(`
    #####################################
    🛡️  Server listening on port: ${config.port}! 🛡️
    #####################################
  `);
    })
    .on('error', err => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();
