import {
  hashPassword,
  CustomError,
  wrapAsyncError,
} from '../../library/index.js';

const isPasswordValid = wrapAsyncError(async (req, res, next) => {
  const user = req.user;

  if (hashPassword(req.body.password) !== user.password) {
    throw new CustomError('Params Invalid', '🔥 Wrong password ', 400);
  }

  next();
});

export default isPasswordValid;
