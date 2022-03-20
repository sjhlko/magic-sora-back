import config from '../config/index.js';
import { models } from '../models/init-models.js';
import { generateToken, verifyToken, refreshToken } from '../library/token.js';
import {
  createTransporter,
  hashPassword,
  CustomError,
} from '../library/index.js';
import user from '../api/routes/user.js';

export class AuthService {
  constructor() {
    this.userAttributes = ['user_id', 'user_email', 'password'];
  }
  async localRegister(newUser) {
    return await models.User.localRegister(newUser);
  }

  async getUserByEmail(email) {
    return await models.User.findByEmail(email, this.userAttributes);
  }

  validatePassword(password, hashedPassword) {
    const hashed = hashPassword(password);
    return hashedPassword === hashed;
  }

  async generateAccessToken(userID) {
    const payload = {
      user_id: userID,
    };
    return await generateToken(payload);
  }

  async generateRefreshToken() {
    return await refreshToken();
  }

  async updateRefreshToken(userID, refreshToken) {
    await models.User.updateUser(userID, { refresh_token: refreshToken });
  }

  loginConfirm(account, password) {
    if (!account) {
      //가입여부 확인
      throw new CustomError(
        'Bad Request',
        '🔥 가입되지 않은 이메일인데요?',
        403,
      );
    } else if (
      //비밀번호 비교
      !this.validatePassword(password, account.password)
    ) {
      throw new CustomError('Bad Request', '🔥 비밀번호를 다시쳐보세요', 403);
    }
  }
}
