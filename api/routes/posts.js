import express from "express";
import { Op } from "sequelize";
import { models } from "../../models/init-models.js"
import path from 'path';
import  sequelize  from "../../models/index.js";
import { Router } from 'express';
const route = Router();

export default app => {
  const __dirname = path.resolve();

  app.use('/posts', route)
  route.get('/hot', async(req, res)=>{

      /*const results = await models.VoteByUser.findAll({
        attributes : ['post_id', [sequelize.fn('count', sequelize.col('post_id')), 'count']],
        group: ['post_id']
      })*/

      const results = await models.Post.findAll({
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('VoteByUsers.post_id')), 'count']],
        },
        include : [{
          model: models.VoteByUser,
          attributes: [],
        }],
        group : ['Post.post_id']
      });
      //미완성!!! tag넣어야함
      res.send(results);
  })


  route.get('/new', async(req, res)=>{
    try{
        const results = await models.Post.findAll({
            include : [{
                model: models.User,
                attributes:['nickname']
            },{
                model: models.Tag,
                attributes: ['tag_name']
            }],
            attributes: ['post_title', 'post_content', 'register_date'],
            order : [['post_id', 'DESC']]
        });
        res.send(results);
    } catch(err){ res.status(400).send({error:error.message});}  
  });

  route.get('/deadline', async(req, res)=>{
    try{
        const results = await models.Post.findAll({
        include : [{
            model: models.User,
            attributes:['nickname']
        },{
            model: models.Tag,
            attributes: ['tag_name']
        }],
        attributes: ['post_title', 'post_content', 'register_date'],
        where: { finish_date : {[Op.gt]:new Date()}},
        order : [['finish_date', 'ASC']]
        });
        res.send(results);
    } catch(err){ res.status(400).send({ error : error.message }); }
  })
  route.get('/end', async(req, res)=>{
    try{
        const results = await models.Post.findAll({
            include : [{
                model: models.User,
                attributes:['nickname']
            },{
                model: models.Tag,
                attributes: ['tag_name']
            }],
            attributes: ['post_title', 'post_content', 'register_date'],
            where: { finish_date : {[Op.lt]:new Date()}},
            order : [['finish_date', 'ASC']]
        });
        res.send(results);
    } catch(err){res.status(400).send({error:error.message});}
  })
  route.get('/favtag', async(req, res)=>{
    res.send('아직 안만들었어');
  })

  route.use(express.static(__dirname + '/public/images'));
  route.get('/:id', async(req, res)=>{
    const post_id = req.params.id;
    console.log(post_id);
    const getPostInfo = await models.Post.findOne({
      include :[{
        model: models.User,
        attributes:['nickname']
      }, {
        model: models.Choice,
        attributes:['choice_id', 'choice_content', 'photo_url']
      },{
        model: models.Tag,
        attributes: ['tag_name']
      }],
      where: {post_id : post_id}
    })
    res.send(getPostInfo);
  })

  route.delete('/:id', async()=>{
    const post_id = req.params.id;
    const deleteTag = await models.TagOfPost.destroy({
      where: {post_id : post_id}
    })//post와 관련된 tag_of_post테이블 삭제
    const deleteChoice = await models.Choice.destroy({
      where: {post_id : post_id}
    })//post와 관련된 choice테이블 삭제
    const deleteVote = await models.VoteByUser.destroy({
      where: {post_id : post_id}
    })//post와 관련된 vote_by_user테이블 삭제
    const deletePost = await models.Post.destroy({
      where : {post_id: post_id}
    })//post와 관련된 post테이블 삭제
  })
}