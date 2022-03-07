import { models } from '../../models/init-models.js';

const isEmailExists = async (req, res, next) => {
  const email = req.query.email;
  try {
    const user = await models.User.findOne({
      where: { user_email: email },
    });

    if (user) {
      return res.json({
        isExists: true,
      });
    }

    return next();
  } catch (err) {
    console.log('🔥 Error checking user email! ', err);
    return next(err);
  }
};

export default isEmailExists;
