import { Router } from 'express';
import { PostService } from '../../services/posts.js';
import { wrapAsyncError } from '../../library/index.js';
import multer from "multer";
import path from "path";
import express from 'express';
import middlewares from '../middlewares/index.js';
const postServiceInstance = new PostService();
const route = Router();
const __dirname = path.resolve();

export default app => {
  app.use('/posts', route)

  //hot, new, end, deadline
  route.get(
    '/', 
    wrapAsyncError(async (req, res, next)=>{
    let type = req.query.type;
    if(type!=='favtag'){
      const posts = await postServiceInstance.getPostList(type);
      res.json(posts);
    }else next();
  }))

  //favtag
  route.get(
    '/',
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async(req, res)=>{
      let type = req.query.type;
      let id = req.user_id;
      const posts = await postServiceInstance.getPostList(type, id)
      res.json(posts);
  }))

  //게시판 삭제
  route.delete(
    '/:id',
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async(req, res)=>{
    const post_id = req.params.id;
    await postServiceInstance.deletePost(post_id)
    return res.sendStatus(200);
  }))

  //게시판 검색
  route.get(
    '/search',
    wrapAsyncError(async(req, res)=>{
    let option = req.query.option;
    let search = req.query.search;
    // /search? option = 옵션 & search = 검색내용
    const posts = await postServiceInstance.searchPost(option, search)
    res.json(posts);
  }))

  //게시판 상세 내용
  route.use(express.static(__dirname + '/public/images'))
  route.get('/:id', async(req, res)=>{
    const post_id = req.params.id;
    const postDetail = await postServiceInstance.getPostDetail(post_id);
    res.json(postDetail)
  })

  //게시판 글쓰기 (프론트에 한글 파일명 되도록 utf-8 넣어야함)
  const storage = multer.diskStorage({
    destination: function(req, file, done){
      done(null, "public/images/");
    },
    filename: function(req, file, done){
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext)+Date.now()+ext);
    }
  });
  const upload = multer({storage: storage});
  route.post(
    '/', 
    upload.array('image'),
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async(req, res)=>{
      const data = req.body;
      const files = req.files;
      const user = req.user_id;
      await postServiceInstance.insertPost(data, files, user);
      return res.sendStatus(200);
  }))
}