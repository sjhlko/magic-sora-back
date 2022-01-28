import express from 'express';

async function startServer() {
  const app = express();
  const port = 3000;

  app.get('/', (req, res) => {
    res.send('마법의 익명고동');
  });

  app.listen(port, () => {
    console.log(`
      #####################################
      🛡️ Server listening on port: ${port}! 🛡️
      #####################################
    `);
  });
}

startServer();
