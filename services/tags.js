import { models } from '../models/init-models.js';
import {
  createTransporter,
  sendMail,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class TagsService {
  async getAllTags(){
		let tags = await models.Tag.findAll();

		tags=tags.map((tag)=>{
			return {
				tag_id : tag.tag_id,
				tag_name: tag.tag_name
      };
		})
		console.log(tags);
		return tags;
	}
}