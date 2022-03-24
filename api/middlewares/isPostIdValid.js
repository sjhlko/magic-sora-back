import { models } from '../../models/init-models.js';
import { wrapAsyncError, CustomError } from '../../library/index.js';

const isPostIdValid = wrapAsyncError(async (req, res, next) => {
  const id = req.params.postId;
  const post = await models.Post.getPostById(id);

  if (!post) {
    throw new CustomError('Not Found', '🔥 Post Not Found', 404);
  }

  req.post = post;
  next();
});

export default isPostIdValid;
