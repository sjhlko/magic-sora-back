import { Router } from 'express';
import { CommentService } from '../../services/comment.js';
import { wrapAsyncError } from '../../library/index.js';
import express from 'express';
import middlewares from '../middlewares/index.js';
const commentServiceInstance = new CommentService();
const route = Router();

export default app => {
  app.use(
    '/posts/:id/comments',
    (req, res, next) => {
      req.post_id = req.params.id;
      next();
    },
    route,
  );

  //로그인 한 경우
  route.get(
    '/',
    middlewares.isPostIdValid,
    middlewares.isGuest,
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    middlewares.isCommentVisible,
    wrapAsyncError(async (req, res) => {
      const comments = await commentServiceInstance.getAllComments(req.post_id);
      const myLikes = await commentServiceInstance.getMyLikes(
        req.post_id,
        req.user_id,
      );
      res.json({ isVisible: true, comments, myLikes });
    }),
  );

  //로그인 안한 경우
  route.get('/', async (req, res) => {
    res.json({ isVisible: false });
  });

  route.post(
    '/',
    middlewares.isPostIdValid,
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async (req, res) => {
      const data = req.body;
      await commentServiceInstance.insertComment(
        req.post_id,
        req.user_id,
        data,
      );
      res.sendStatus(201);
    }),
  );

  route.delete(
    '/:id',
    middlewares.isPostIdValid,
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    middlewares.isDeleteValid,
    wrapAsyncError(async (req, res) => {
      const post_id = req.post_id;
      const comment_id = req.params.id;
      const user_id = req.user_id;
      await commentServiceInstance.deleteComment(user_id, post_id, comment_id);

      return res.sendStatus(204);
    }),
  );

  route.post(
    '/likes',
    middlewares.isPostIdValid,
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    middlewares.isLikesValid,
    wrapAsyncError(async (req, res) => {
      const user_id = req.user_id;
      const post_id = req.post_id;
      const comment_id = req.body.comment_id;
      await commentServiceInstance.addLikes(user_id, post_id, comment_id);
      return res.sendStatus(201);
    }),
  );

  route.delete(
    '/likes/:id',
    middlewares.isPostIdValid,
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async (req, res) => {
      const user_id = req.user_id;
      const post_id = req.post_id;
      const comment_id = req.params.id;
      await commentServiceInstance.deleteLikes(user_id, post_id, comment_id);
      return res.sendStatus(204);
    }),
  );
};
