import { models } from '../../models/init-models.js';
import { CustomError, wrapAsyncError } from '../../library/index.js';

const isEmailExists = wrapAsyncError(async (req, res, next) => {
  const email = req.query.email || req.body.user_email;
  const user = await models.User.findOne({
    where: { user_email: email },
  });

  if (user) {
    throw new CustomError('Params Invalid', '🔥 Email Already Exists', 400);
  }

  next();
});

export default isEmailExists;
