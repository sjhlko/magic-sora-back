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
