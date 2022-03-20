import jwt from 'jsonwebtoken';
import {
  wrapAsyncError,
  verifyToken,
  CustomError,
} from '../../library/index.js';

const isAuth = wrapAsyncError(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const decoded = verifyToken(accessToken);
    const userID = jwt.decode(accessToken).user_id;

    //Access token이 만료된 경우
    if (decoded.message == 'jwt expired') {
      throw new CustomError(
        'Json Web Token Error',
        '🔥 Accesstoken expired ',
        401,
      );
    }

    //AccessToken이 유효하지 않은 값인경우
    if (decoded.ok == false) {
      throw new CustomError('Json Web Token Error', '🔥 Invalid Token ', 401);
    }

    //AccessToken유효한 경우
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
