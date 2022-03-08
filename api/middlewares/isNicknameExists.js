import { models } from '../../models/init-models.js';
import { wrapAsyncError } from '../../library/index.js';

const isNicknameExists = wrapAsyncError(async (req, res, next) => {
  const nickname = req.query.nickname || req.body.nickname;
  if (nickname) {
    const user = await models.User.findOne({
      where: { nickname: nickname },
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
