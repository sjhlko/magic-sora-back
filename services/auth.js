import { models } from '../models/init-models.js';
import {
  generateToken,
  refreshToken,
  CustomError,
  verifyToken,
} from '../library/index.js';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor() {
    this.userAttributes = [
      'user_id',
      'user_email',
      'password',
      'refresh_token',
    ];
  }

  async localRegister(newUser) {
    return await models.User.createUser(newUser);
  }

  async localLogin(userID) {
    const token = {
      access: await generateToken({
        user_id: userID,
      }),
      refresh: refreshToken(),
    };
    await models.User.updateUser(userID, {
      refresh_token: token.refresh,
    });
    return token;
  }

  async logout(accessToken) {
    const userID = jwt.decode(accessToken).user_id;
    await models.User.updateUser(userID, { refresh_token: null });
  }

  async refreshCheck(accessToken, refreshToken) {
    const userID = jwt.decode(accessToken).user_id;
    const user = await models.User.findById(userID, this.userAttributes);
    if (user.refresh_token === null) {
      throw new CustomError('Bad Request', '🔥 Login required', 401);
    }

    verifyToken(refreshToken);

    if (refreshToken === user.refresh_token) {
      return await generateToken({ user_id: user.user_id });
    } else {
      throw new CustomError(
        'Json Web Token Error',
        '🔥 Invalid refresh token',
        401,
      );
    }
  }
}
