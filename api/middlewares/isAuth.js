import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import { wrapAsyncError } from '../../library/index.js';

const isAuth = wrapAsyncError(async (req, res, next) => {
  const token = req.headers['authorization'];

  const decoded = jwt.verify(token, config.jwtSecret);
  req.token_id = decoded.id;
  next();
});

export default isAuth;
