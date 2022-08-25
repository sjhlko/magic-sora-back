import { models } from '../../models/init-models.js';
import { wrapAsyncError } from '../../library/index.js';

const isCommentVisible = wrapAsyncError(async (req, res, next) => {
  const vote = await models.VoteByUser.getUserVote({
    userId: req.user_id,
    postId: req.post_id,
  });
  const post = await models.Post.findOne({ where: { post_id: req.post_id } });

  if (
    vote ||
    post.user_id == req.user_id ||
    new Date(post.finish_date) < new Date()
  )
    next();
  else next('route');
});

export default isCommentVisible;
