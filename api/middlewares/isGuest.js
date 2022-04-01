import { models } from '../../models/init-models.js';
import { wrapAsyncError, CustomError } from '../../library/index.js';

const isGuest = wrapAsyncError(async(req, res, next)=>{
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    req.cookies['refresh']
  ){
    next();
  }
  res.send({ isVisible : false });
})
  
export default isGuest;