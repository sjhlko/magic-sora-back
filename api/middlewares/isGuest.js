import { wrapAsyncError } from '../../library/index.js';

const isGuest = wrapAsyncError(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    req.cookies['refresh']
  )
    return next();
  next('route');
});

export default isGuest;
