import config from '../config/index.js';
import { models } from '../models/init-models.js';
import {
  createTransporter,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class AuthService {
  constructor() {
    this.userAttributes = ['user_email', 'password'];
  }
  async localRegister(newUser) {
    newUser.password = hashPassword(newUser.password);
    return await models.User.localRegister(newUser);
  }

  async getUserByEmail(email) {
    return await models.User.findByEmail(email, this.userAttributes);
  }

  validatePassword(password, hashedPassword) {
    const hashed = hashPassword(password);
    return hashedPassword === hashed;
  }
}
