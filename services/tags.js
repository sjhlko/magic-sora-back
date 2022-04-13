import { models } from '../models/init-models.js';
import {
  createTransporter,
  sendMail,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class TagsService {
  async getAllTags() {
    let tags = await models.Tag.findAll();
    return tags;
  }
}
