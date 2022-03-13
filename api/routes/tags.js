import { Router } from 'express';
import { wrapAsyncError } from '../../library/index.js';
import { TagsService } from '../../services/tags.js';
const route = Router();
const tagServiceInstance = new TagsService();

export default app =>{
  app.use('/tags', route);

  route.get(
    '/',
    wrapAsyncError(async(req, res)=>{
      const tags = await tagServiceInstance.getAllTags();
      res.send(tags);
    })
  )
}