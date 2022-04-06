import { models } from '../../models/init-models.js';
import { CustomError, wrapAsyncError } from '../../library/index.js';

const isCommentVisible = wrapAsyncError(async (req, res, next) => {
  const vote = await models.VoteByUser.getUserVote({
    userId: req.user_id,
    postId: req.post_id,
  });
  const post = await models.Post.findOne({ where: { post_id: req.post_id } });
  //댓글 보이는 경우: 투표한 사람, 글 작성자, 마감 날짜 이후
  if (
    vote ||
    post.user_id == req.user_id ||
    new Date(post.finish_date) < new Date()
  )
    next();
  res.send({ isVisible: false });
});

export default isCommentVisible;
