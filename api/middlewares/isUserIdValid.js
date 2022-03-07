import { models } from '../../models/init-models.js';
import { CustomError, wrapAsyncError } from '../../library/index.js';

const isUserIdValid = wrapAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const user = await models.User.findOne({
    where: { user_id: id },
    attributes: ['user_id'],
  });

  if (!user) {
    throw new CustomError('Not Found', '🔥 User Not Found', 404);
  }
  next();
});

export default isUserIdValid;
