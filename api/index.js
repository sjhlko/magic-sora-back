import { Router } from 'express';
import user from './routes/user.js';
import auth from './routes/auth.js';

export default () => {
  const app = Router();
  user(app);
  auth(app);
  return app;
};
