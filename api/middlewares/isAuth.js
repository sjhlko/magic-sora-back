import { wrapAsyncError, verifyToken } from '../../library/index.js';

const isAuth = wrapAsyncError(async (req, res, next) => {
  const token = req.headers['authorization'];

  const decoded = verifyToken(token);
  req.token_id = decoded.user_id;
  next();
});

export default isAuth;
