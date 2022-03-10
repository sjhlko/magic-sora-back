import { models } from '../../models/init-models.js';
import { wrapAsyncError } from '../../library/index.js';

const isEmailExists = wrapAsyncError(async (req, res, next) => {
  const email = req.query.email || req.body.user_email;
  const user = await models.User.findOne({
    where: { user_email: email },
  });

  if (user) {
    return res.json({
      isExists: true,
    });
  }

  next();
});

export default isEmailExists;
