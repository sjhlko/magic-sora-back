import { Router } from 'express';
import { PostService } from '../../services/posts.js';
import { wrapAsyncError } from '../../library/index.js';
import express from 'express';
import middlewares from '../middlewares/index.js';
const postServiceInstance = new PostService();
const route = Router();

export default app => {
  app.use('/posts', route);

  //hot, new, end, deadline
  route.get(
    '/',
    wrapAsyncError(async (req, res, next) => {
      let type = req.query.type;
      if (type !== 'favtag') {
        const posts = await postServiceInstance.getPostList(type);
        res.json(posts);
      } else next();
    }),
  );

  //favtag
  route.get(
    '/',
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async (req, res) => {
      let type = req.query.type;
      let id = req.user_id;
      const posts = await postServiceInstance.getPostList(type, id);
      res.json(posts);
    }),
  );

  //게시판 삭제
  route.delete(
    '/:id',
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async (req, res) => {
      const post_id = req.params.id;
      await postServiceInstance.deletePost(post_id);
      return res.sendStatus(204);
    }),
  );

  //게시판 검색
  route.get(
    '/search',
    wrapAsyncError(async (req, res) => {
      let option = req.query.option;
      let search = req.query.search;
      // /search? option = 옵션 & search = 검색내용
      const posts = await postServiceInstance.searchPost(option, search);
      res.json(posts);
    }),
  );

  //게시판 상세 내용
  route.get(
    '/:id',
    middlewares.isPostIdValid,
    wrapAsyncError(async (req, res) => {
      const post_id = req.params.id;
      const postDetail = await postServiceInstance.getPostDetail(post_id);
      res.json(postDetail);
    }),
  );

  //게시판 글쓰기
  route.post(
    '/',
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async (req, res) => {
      const data = req.body;
      const user = req.user_id;
      await postServiceInstance.insertPost(data, user);
      return res.sendStatus(201);
    }),
  );
};
