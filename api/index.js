import { Router } from 'express';
import posts from './routes/posts.js';
import user from './routes/user.js';
import auth from './routes/auth.js';
import choice from './routes/choice.js';
import tags from './routes/tags.js';

export default () => {
  const app = Router();
  user(app);
  auth(app);
  posts(app);
  choice(app);
  tags(app);
  return app;
};
