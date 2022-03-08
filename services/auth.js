import config from '../config/index.js';
import { models } from '../models/init-models.js';
import {
  createTransporter,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class AuthService {
  constructor() {}
  async localRegister(newUser) {
    newUser.password = hashPassword(newUser.password);
    return await models.User.localRegister(newUser);
  }
}
