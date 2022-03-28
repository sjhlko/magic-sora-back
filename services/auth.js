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

  async getUserByEmail(email) {
    return await models.User.findByEmail(email, this.userAttributes);
  }

  async getUserByAccessToken(accessToken) {
    const userID = jwt.decode(accessToken).user_id;
    return await models.User.findById(userID, this.userAttributes);
  }

  async updateRefreshToken(userID, refreshToken) {
    await models.User.updateUser(userID, { refresh_token: refreshToken });
  }

  async localRegister(newUser) {
    return await models.User.createUser(newUser);
  }

  async localLogin(userID) {
    const payload = {
      user_id: userID,
    };
    const token = {
      access: await generateToken(payload),
      refresh: refreshToken(),
    };
    await this.updateRefreshToken(userID, token.refresh);
    return token;
  }

  async logout(accessToken) {
    const userID = jwt.decode(accessToken).user_id;
    await this.updateRefreshToken(userID, null);
  }

  async refreshCheck(accessToken, refreshToken) {
    const user = await this.getUserByAccessToken(accessToken);
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
