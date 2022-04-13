import { wrapAsyncError } from '../../library/index.js';

const isGuest = wrapAsyncError(async (req, res, next) => {
  if (req.headers.authorization) return next();
  next('route');
});

export default isGuest;
