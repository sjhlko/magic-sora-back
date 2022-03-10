import config from '../config/index.js';
import { models } from '../models/init-models.js';
import {
  createTransporter,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class UserService{
  async getPostList(type){ //query문에서 받아온 것 new, deadline, end ...
    let posts;
    if(type == 'new') {posts = await models.Post.getNewPost();}
    else if(type == 'deadline') {posts = await models.Post.getDeadlinePost();}
    else if(type == 'end') {posts = await models.Post.getEndPost();}
    else if(type == 'hot') {posts = await models.Post.getHotPost();}

    posts = posts.map(async (post)=>{
      const user = await models.User.findById(post.user_id, ['nickname']);
      return post.getPostInfo(user);
    })
    posts = await Promise.all(posts);

    return posts;
  }

  async deletePost(id){
    await models.VoteByUser.deleteVoteByUser(id);
    await models.Choice.deleteChoice(id);
    await models.TagOfPost.deleteTagOfPost(id);
    await models.Post.deletePost(id);
  }

  async searchPost(option, search){
    let user, posts;
    search = '%'+search.replace(' ', '%')+'%';
    if(option == 'nickname'){
      user = await models.User.findByNickname(search, ['user_id']);
      posts = await user.getPosts();
      posts = posts.map(async (post)=>{
        return post.getPostInfo(user)
      })
    }
    else{
      if(option == 'post_title'){ 
        posts = await models.Post.searchPostTitle(search) 
      }
      else if(option == 'post_content') {
        posts = await models.Post.searchPostContent(search) 
      }
      posts = posts.map(async (post)=>{
        const user = await models.User.findById(post.user_id, ['nickname']);
        return post.getPostInfo(user);
      })
    }
    posts = await Promise.all(posts);
    return posts;
  }
  async getPostDetail(id){
    let post = await models.Post.getPostById(id);
    const user = await models.User.findById(post.user_id, ['nickname']);

    post = post.getPostDetailInfo(user);
    return post;
  }

  async insertPost(){
    const { post_title, post_content, nickname, tag, finish_date, choice, image } = req.body;
    //nickname은 로그인 정보에서 불러오기로 바꿔야함.
    //글쓸때 로그인했는지안했는지 확인하는거필요
    const register_date = new Date();
    const user_id = await models.User.findByNickname(nickname, ['user_id'])
    models.Post.create({
      user_id: user_id,
      post_title: post_title,
      post_content: post_content,
      register_date: register_date,
      finish_date: finish_date
    })
    const post_id = await models.Post.getLatestPostId();
     //tag 입력 요소가 1개면 배열이 아니므로 배열로 바꿔주는 코드
    let tagArray=[];
    if(!Array.isArray(tag)){ tagArray = Array.from (tag); }
    else { tagArray = tag; }

    //TagOfPost에 post와 관련된 tag 등록
    tagArray.forEach(async (item)=>{
      await models.TagOfPost.create({
        post_id: post_id,
        tag_id: item
      })
    })
    //Choice에 post와 관련된 choice 등록
    choice.forEach(async(item, index)=>{
      await models.Choice.create({
        choice_id: index + 1,
        post_id: post_id,
        choice_content: item,
        photo_url: req.files[index].filename 
      })
    })
  }
}