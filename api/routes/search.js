import express from "express";
import { models } from "../../models/init-models.js";
import { Op } from "sequelize";
import bodyParser from "body-parser";
import { Router } from 'express';
const route = express.Router();

export default app =>{
  app.use('/search', route);

  route.use(bodyParser.urlencoded({extended: false}));
  route.get('/', async(req, res)=>{
    let option = req.query.option;
    let search = req.query.search;
    // /search? option = 옵션 & search = 검색내용
    let results;
    search = '%'+search.replace(' ', '%')+'%';
    if(option == 'post_title'){
        results = await models.Post.findAll({
            include : [{
                model: models.User,
                attributes:['nickname']
            }],
            attributes: ['post_title', 'post_content', 'register_date'],
            where: { post_title : {[Op.like]: search}},
        })
    }
    else if(option == 'post_content'){
        results = await models.Post.findAll({
            include : [{
                model: models.User,
                attributes:['nickname']
            }],
            attributes: ['post_title', 'post_content', 'register_date'],
            where: { post_content : {[Op.like]: search}},
        })
    }
    else if(option == 'nickname'){
        let getUserId = await models.User.findOne({
            attributes: ['user_id'],
            where: { nickname : {[Op.like]: search} }
        })
        const user_id = getUserId.dataValues.user_id;
        results = await models.Post.findAll({
            include: [{
                model: models.User,
                attributes: ['nickname']
            }],
            attributes: ['post_title', 'post_content', 'register_date'],
            where: { user_id : user_id}
        })
    }
    res.send(results);
  })
}