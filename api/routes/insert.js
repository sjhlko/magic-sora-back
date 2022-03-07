import express from "express";
import { Op } from "sequelize";
import { models } from "../../models/init-models.js"
import multer from "multer";
import path from "path";
import { Router } from 'express';
const route = Router();

export default app =>{
  app.use('/insert', route);
  const storage = multer.diskStorage({
    destination: function(req, file, done){
      done(null, "public/images/"); //경로 설정
      //done 콜백 함수 실행
    },
    filename: function(req, file, done){
      const ext = path.extname(file.originalname); //확장자 추출
      done(null, path.basename(file.originalname, ext)+Date.now()+ext);
    //새롭게 이름 붙이기 (파일이름 + 현재 날짜 .확장자)
    }
  });
  const upload = multer({storage: storage});

  route.get('/', async(req, res)=>{
      res.render('insert');
  })
  route.post('/', upload.array('image'), async(req, res)=>{
    const { post_title, post_content, nickname, tag, finish_date, choice, image } = req.body;
    //nickname은 로그인 정보에서 불러오기로 바꿔야함.
    const register_date = new Date();
    //register_date: 현재 시간
    const getUserId = await models.User.findOne({
      attributes: ['user_id'],
      where: { nickname : nickname }
    })
    const user_id = getUserId.dataValues.user_id;
    //nickname에서 user_id 추출하기
    const insertPost = await models.Post.create({
      user_id: user_id,
      post_title: post_title,
      post_content: post_content,
      register_date: register_date,
      finish_date: finish_date
    })
    .then((result)=>{console.log('Post insert 성공')})
    .catch((err)=>{console.log('Post insert 에러')})

    const getPostId = await models.Post.findOne({
      attribute : ['post_id'],
      limit : 1,
      order : [['post_id', 'DESC']]
      //최신 등록된 POST_ID값
    })
    const post_id = getPostId.dataValues.post_id;

   let tagArray=[];
    if(!Array.isArray(tag)){ tagArray = Array.from (tag); }
    else { tagArray = tag; }
    //tag 입력 요소가 1개면 배열이 아니므로 배열로 바꿔주는 코드

    tagArray.forEach(async (item, index)=>{
      const insertTag = await models.TagOfPost.create({
        post_id: post_id,
        tag_id: item
      })
    })
    //TagOfPost에 post와 관련된 tag 등록

    choice.forEach(async(item, index)=>{
      const insertChoice = await models.Choice.create({
        choice_id: index+1,
        post_id: post_id,
        choice_content: item,
        photo_url: req.files[index].filename 
      })
    })
    //Choice에 post와 관련된 choice 등록

    res.redirect('/posts/new');
    //신규 게시판으로 경로 설정
  })
}