import {
  wrapAsyncError,
  verifyToken,
  CustomError,
} from '../../library/index.js';

const isAuth = wrapAsyncError(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];

    const decoded = verifyToken(token);
    req.token_id = decoded.user_id;
    next();
  } else {
    throw new CustomError('Json Web Token Error', '🔥 Token Not Found', 401);
  }
});

export default isAuth;
