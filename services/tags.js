import { models } from '../models/init-models.js';

export class TagsService {
  async getAllTags() {
    let tags = await models.Tag.findAll();
    return tags;
  }
}
