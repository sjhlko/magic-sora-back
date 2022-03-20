import jwt from 'jsonwebtoken';
import {
  wrapAsyncError,
  verifyToken,
  generateToken,
  CustomError,
} from '../../library/index.js';
import { models } from '../../models/init-models.js';

const isAuth = wrapAsyncError(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.headers.refresh;
    const decoded = verifyToken(accessToken);
    const userID = jwt.decode(accessToken).user_id;
    const user = await models.User.findById(userID, ['refresh_token']);

    //로그인이 되어있는지 확인
    if (user.refresh_token === null) {
      throw new CustomError('Json Web Token Error', '🔥 Login required', 401);
    }

    //console.log(decoded);

    //AccessToken이 만료된 경우
    if (decoded.message == 'jwt expired') {
      //RefreshToken이 헤더에 포함되지 않았을 경우
      if (!refreshToken) {
        throw new CustomError(
          'Json Web Token Error',
          '🔥 expired Access token. You have to check Refresh Token ',
          401,
        );
      }
      //RefreshToken이 헤더에 포함된 경우
      const decodedRefreshToken = verifyToken(refreshToken);
      //console.log(decodedRefreshToken, userID);
      //const user = await models.User.findById(userID, ['refresh_token']); //user db에 저장된 refresh token

      //RefreshToken이 만료된 경우
      if (decodedRefreshToken.message == 'jwt expired') {
        throw new CustomError(
          'Json Web Token Error',
          '🔥 Expired refresh token. (Login expired)',
          401,
        );
      }

      //RefreshToken이 만료되지 않은경우
      else {
        //RefreshToken이 올바른 경우
        if (refreshToken === user.refresh_token) {
          const newAccessToken = await generateToken({ user_id: userID });
          res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 14,
          });
          return res.status(200).send({
            data: {
              access_token: newAccessToken,
            },
          });
        }
        //RefreshToken이 올바르지 않은 경우
        else {
          throw new CustomError(
            'Json Web Token Error',
            '🔥 Invalid refresh token',
            401,
          );
        }
      }
    }

    //AccessToken이 유효하지 않은 값인경우
    if (decoded.ok == false) {
      throw new CustomError('Json Web Token Error', '🔥 Invalid Token ', 401);
    }

    //AccessToken이 만료되지 않은 경우
    req.accessToken_id = userID;
    next();
  }
  //AccessToken이 헤더에 포함되지 않은경우
  else {
    throw new CustomError(
      'Json Web Token Error',
      '🔥 Access token Not Found',
      401,
    );
  }
});

export default isAuth;
