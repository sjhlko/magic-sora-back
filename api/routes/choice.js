import { Router } from 'express';
import { wrapAsyncError } from '../../library/index.js';
import { ChoiceService } from '../../services/choice.js';
import middlewares from '../middlewares/index.js';
const route = Router();
const ChoiceServiceInstance = new ChoiceService();

export default app => {
  app.use(
    '/posts/:id/options',
    (req, res, next) => {
      req.post_id = req.params.id;
      next();
    },
    route,
  );

  /**
   * 로그인 한 상태
   * 전체 선택지 목록 + 투표한 선택지 번호 응답으로 전송
   */
  route.get(
    '/',
    middlewares.isGuest,
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    middlewares.isPostIdValid,
    wrapAsyncError(async (req, res, next) => {
      const userId = req.user_id;
      const postId = req.post_id;
      const { choices, isVoted, myVote } =
        await ChoiceServiceInstance.getPostChoices(postId, userId);

      res.json({ isVoted: isVoted, myVote: myVote, choices: choices });
    }),
  );

  /**
   * 로그인 안 한 상태
   * isGuest에서 next('route')로 넘어옴
   * 전체 선택지 목록만 응답으로 전송
   */
  route.get('/', async (req, res) => {
    const postId = req.post_id;
    const { choices, isVoted } = await ChoiceServiceInstance.getPostChoices(
      postId,
    );

    res.json({ isVoted: isVoted, choices: choices });
  });

  route.post(
    '/',
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    middlewares.isPostIdValid,
    wrapAsyncError(async (req, res) => {
      const userId = req.user_id;
      const postId = req.post_id;
      const choiceId = req.body.choice_id;
      await ChoiceServiceInstance.voteChoice(userId, postId, choiceId);

      res.sendStatus(201);
    }),
  );

  route.get(
    '/results',
    middlewares.isPostIdValid,
    wrapAsyncError(async (req, res) => {
      const postId = req.post_id;
      const voteResult = await ChoiceServiceInstance.getVoteResult(postId);

      res.json(voteResult);
    }),
  );
};
