import { models } from '../../models/init-models.js';

const isUserIdValid = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await models.User.findOne({
      where: { user_id: id },
      attributes: ['user_id'],
    });

    if (!user) {
      return res.status(404).send('User Not Found');
    }
    return next();
  } catch (err) {
    console.log('🔥 Error checking user id valid! ', err);
    return next(err);
  }
};

export default isUserIdValid;
