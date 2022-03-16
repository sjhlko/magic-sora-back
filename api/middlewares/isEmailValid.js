import { models } from '../../models/init-models.js';
import { wrapAsyncError, CustomError } from '../../library/index.js';

const isEmailValid = wrapAsyncError(async (req, res, next) => {
  const email = req.body.email;
  const user = await models.User.findByEmail(email, [
    'user_id',
    'user_email',
    'password',
    'nickname',
  ]);

  if (!user) {
    throw new CustomError('Not Found', '🔥 User Not Found', 404);
  }

  req.user = user;
  next();
});

export default isEmailValid;
