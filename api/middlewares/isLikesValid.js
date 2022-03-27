import { models } from '../../models/init-models.js';
import { wrapAsyncError, CustomError } from '../../library/index.js';

const isLikesValid = wrapAsyncError(async(req, res, next)=>{
  const comment_id = req.body.comment_id
  const comment = await models.Comment.findById(comment_id)
  if(comment.user_id == req.user_id){
    throw new CustomError('Bad Request', '🔥 자신이 쓴 댓글에 좋아요를 누를 수 없습니다', 403)
  }
  
  next()
})

export default isLikesValid;