import { Router } from 'express';
import posts from './routes/posts.js';
import user from './routes/user.js';
import auth from './routes/auth.js';

export default () => {
  const app = Router();
  user(app);
  auth(app);
  posts(app);
  return app;
};
