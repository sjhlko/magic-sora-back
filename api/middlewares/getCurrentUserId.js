import { models } from '../../models/init-models.js';
import { CustomError, wrapAsyncError } from '../../library/index.js';

const getCurrentUserId = wrapAsyncError(async (req, res, next) => {
  const user = await models.User.findById(req.token_id, ['user_id']);

  if (!user) {
    throw new CustomError('Unauthorized', '🔥 User Not Found', 401);
  }

  req.user_id = user.user_id;
  next();
});

export default getCurrentUserId;
