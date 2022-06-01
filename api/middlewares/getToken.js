import {
  wrapAsyncError,
  verifyToken,
  CustomError,
} from '../../library/index.js';

const getToken = wrapAsyncError(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    req.cookies['refresh']
  ) {
    req.accessToken = req.headers.authorization.split(' ')[1];
    req.refreshToken = req.cookies['refresh'];
    next();
  } else {
    throw new CustomError(
      'Json Web Token Error',
      '🔥 Access token Not Found',
      401,
    );
  }
});

export default getToken;
