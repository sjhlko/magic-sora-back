import { models } from '../../models/init-models.js';
import { CustomError, wrapAsyncError } from '../../library/index.js';

const isNicknameExists = wrapAsyncError(async (req, res, next) => {
  const nickname = req.query.nickname || req.body.nickname;
  if (nickname) {
    const user = await models.User.findOne({
      where: { nickname: nickname },
    });

    if (user) {
      throw new CustomError(
        'Params Invalid',
        '🔥 Nickname Already Exists',
        400,
      );
    }
  }

  next();
});

export default isNicknameExists;
