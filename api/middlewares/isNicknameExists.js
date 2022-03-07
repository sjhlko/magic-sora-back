import { models } from '../../models/init-models.js';

const isNicknameExists = async (req, res, next) => {
  const nickName = req.query.nickName || req.body.nickname;
  try {
    if (nickName) {
      const user = await models.User.findOne({
        where: { nickname: nickName },
      });

      if (user) {
        return res.json({
          isExists: true,
        });
      }
    }

    return next();
  } catch (err) {
    console.log('🔥 Error checking user email! ', err);
    return next(err);
  }
};

export default isNicknameExists;
