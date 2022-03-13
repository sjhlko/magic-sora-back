import { wrapAsyncError, CustomError } from '../../library/index.js';
import { models } from '../../models/init-models.js';

const isUserIdValid = wrapAsyncError(async (req, res, next) => {
  const id = req.body.id;
  const user = await models.User.findById(id, ['user_id', 'password']);

  if (!user) {
    throw new CustomError('Not Found', '🔥 User Not Found', 404);
  }

  req.user = user;
  next();
});

export default isUserIdValid;
