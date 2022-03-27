import { models } from '../../models/init-models.js';
import { CustomError, wrapAsyncError } from '../../library/index.js';

const isDeleteValid = wrapAsyncError(async(req, res, next)=>{
  const comment_id = req.params.id
  const comment = await models.Comment.findById(comment_id)

  if(comment.user_id != req.user_id){
    throw new CustomError('Bad Request', '🔥 자신이 쓴 댓글만 삭제할 수 있습니다.', 403)
  }
  
  next()
})
export default isDeleteValid