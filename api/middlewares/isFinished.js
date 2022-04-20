import { models } from '../../models/init-models.js';
import { wrapAsyncError } from '../../library/index.js';

const isFinished = wrapAsyncError(async (req, res, next) => {
  const post = await models.Post.findOne({
    where: { post_id: req.post_id },
    attributes: ['finish_date'],
  });
  if (new Date(post.finish_date) > new Date()) {
    return res.json({ isVisible: false });
  }
  next();
});
export default isFinished;
