import { Router } from 'express';
import insert from './routes/insert.js';
import posts from './routes/posts.js';
import search from './routes/search.js';
import user from './routes/user.js';
import auth from './routes/auth.js';

export default () => {
  const app = Router();
  user(app);
  auth(app);
  posts(app);
  search(app);
  insert(app);
  return app;
};
