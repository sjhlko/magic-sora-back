import {
  wrapAsyncError,
  verifyToken,
  CustomError,
} from '../../library/index.js';

const isAuth = wrapAsyncError(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    req.cookies['refresh']
  ) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const decoded = verifyToken(accessToken);
    req.accessToken_id = decoded.user_id;
    next();
  } else {
    throw new CustomError(
      'Json Web Token Error',
      '🔥 Access token Not Found',
      401,
    );
  }
});

export default isAuth;
