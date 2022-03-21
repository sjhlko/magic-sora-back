import { Router } from 'express';
import { wrapAsyncError } from '../../library/index.js';
import { ChoiceService } from '../../services/choice.js';
import middlewares from '../middlewares/index.js';
const route = Router();
const ChoiceServiceInstance = new ChoiceService();

export default app => {
  app.use('/posts/options', route);

  // 전체 투표 결과 조회
  route.get(
    '/:postId',
    middlewares.isPostIdValid,
    wrapAsyncError(async (req, res) => {
      const postId = req.params.postId;
      const voteResult = await ChoiceServiceInstance.getVoteResultAll(postId);

      res.json(voteResult);
    }),
  );

  // 개별 선택지 투표 결과 조회
  route.get(
    '/:postId/:choiceId',
    middlewares.isPostIdValid,
    wrapAsyncError(async (req, res) => {
      const userId = req.user_id;
      const { postId, choiceId } = req.params;
      const voteResult = await ChoiceServiceInstance.getVoteResultOne(
        userId,
        postId,
        choiceId,
      );

      res.json(voteResult);
    }),
  );

  // 선택지 투표
  route.post(
    '/:postId',
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    middlewares.isPostIdValid,
    wrapAsyncError(async (req, res) => {
      const userId = req.user_id;
      const postId = req.params.postId;
      const choiceId = req.body.choice_id;
      await ChoiceServiceInstance.voteChoice(userId, postId, choiceId);

      res.sendStatus(201);
    }),
  );
};
