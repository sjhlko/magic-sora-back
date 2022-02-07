import express from 'express';
import config from './config/index.js';
import loaders from './loaders/index.js';

async function startServer() {
  const app = express();

  loaders(app);

  app.get('/', (req, res) => {
    res.send('마법의 익명고동');
  });

  app
    .listen(config.port, () => {
      console.log(`
      #####################################
      🛡️ Server listening on port: ${config.port}! 🛡️
      #####################################
    `);
    })
    .on('error', err => {
      console.error('Starting server failed:', err);
      process.exit(1);
    });
}

startServer();
