import { Router } from 'express';
import { UserService } from '../../services/posts.js';
import multer from "multer";
import path from "path";
import express from 'express';
const userServiceInstance = new UserService();
const route = Router();
const __dirname = path.resolve();

export default app => {
  app.use('/posts', route)

  //hot, new, end, deadline, favtag 게시판 => favtag는 아직 안함..
  route.get('/', async(req, res)=>{
    const type = req.query.type; // posts?type = hot
    const posts = await userServiceInstance.getPostList(`${type}`);
    res.send(posts);
  })

  //게시판 삭제
  route.delete('/:id', async(req, res)=>{
    const post_id = req.params.id;
    await userServiceInstance.deletePost(`${post_id}`)
    return res.sendStatus(200);
  })

  //게시판 검색
  route.get('/search', async(req, res)=>{
    let option = req.query.option;
    let search = req.query.search;
    // /search? option = 옵션 & search = 검색내용
    const posts = await userServiceInstance.searchPost(option, search)
    res.send(posts);
  })

  //게시판 상세 내용
  route.use(express.static(__dirname + '/public/images'))
  route.get('/:id', async(req, res)=>{
    const post_id = req.params.id;
    const postDetail = await userServiceInstance.getPostDetail(post_id);
    res.send(postDetail)
  })

  //게시판 글쓰기
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
  route.post('/', upload.array('image'), async(req, res)=>{
    await userServiceInstance.insertPost();
    return res.sendStatus(200);
  })
}