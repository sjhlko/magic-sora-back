import { Router } from 'express';
import posts from './routes/posts.js';
import user from './routes/user.js';
import auth from './routes/auth.js';
import tags from './routes/tags.js';

export default () => {
  const app = Router();
  user(app);
  auth(app);
  posts(app);
  tags(app);
  return app;
};
