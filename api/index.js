import { Router } from 'express';
import user from './routes/user.js';

export default () => {
  const app = Router();
  user(app);
  return app;
};
