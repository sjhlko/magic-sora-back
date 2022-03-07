import { models } from '../../models/init-models.js';
import { wrapAsyncError } from '../../library/index.js';

const isNicknameExists = wrapAsyncError(async (req, res, next) => {
  const nickName = req.query.nickName || req.body.nickname;
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

  next();
});

export default isNicknameExists;
