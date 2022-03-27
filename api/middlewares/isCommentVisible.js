import { models } from '../../models/init-models.js';
import { CustomError, wrapAsyncError } from '../../library/index.js';

const isCommentVisible = wrapAsyncError(async (req, res, next)=>{
  const vote = await models.VoteByUser.getUserVote({
    user: req.user_id,
    post: req.post_id,
  })
  const post = await models.Post.findOne({where: {post_id: req.post_id}})
  //댓글 보이는 경우: 투표 끝났을 때, 글 작성자, 투표한 사람
  if (vote) next()
  else if(post.user_id == req.user_id) next()
  else if(new Date(post.finish_date)<new Date()) next()
  else res.send({
    isVisible: false
  })
})
export default isCommentVisible;