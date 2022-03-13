import config from '../config/index.js';
import { models } from '../models/init-models.js';
import {
  createTransporter,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class PostService{
  async getPostList(type, id){ //query문에서 받아온 것 new, deadline, end ...
    let posts;
    if(type == 'new') {posts = await models.Post.getNewPost();}
    else if(type == 'deadline') {posts = await models.Post.getDeadlinePost();}
    else if(type == 'end') {posts = await models.Post.getEndPost();}
    else if(type == 'hot') {posts = await models.Post.getHotPost();}
    else if(type == 'favtag'){
      const user = await models.User.findById(id, ['user_id']);
      let tags = await user.getTags();
      tags = tags.map((tag)=>{
        return tag.tag_id
      })
      let post_id = await models.TagOfPost.findAll({where: {tag_id : tags}});
      post_id = post_id.map((post_id)=>{
        return post_id.post_id
      })
      post_id = Array.from(new Set(post_id));
      posts= await models.Post.getFavTagPost(post_id);
    }

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

  async insertPost(data, files, user_id){
    const register_date = new Date();
    await models.Post.create({
      user_id: user_id,
      post_title: data.post_title,
      post_content: data.post_content,
      register_date: register_date,
      finish_date: data.finish_date
    })
    //게시글 등록 시 post_id를 구하는 쿼리
    const getPostId = await models.Post.getLatestPost();
    let post_id = getPostId.post_id;

     //tag 입력 요소가 1개면 배열이 아니므로 배열로 바꿔주는 코드
     //tag 입력 요소는 tag_id가 오도록 한다.
    let tagArray=[];
    if(!Array.isArray(data.tag)){ tagArray = Array.from (data.tag); }
    else { tagArray = data.tag; }

    //TagOfPost에 post와 관련된 tag 등록
    tagArray.forEach(async (item)=>{
      await models.TagOfPost.create({
        post_id: post_id,
        tag_id: item
      })
    })

    //Choice에 post와 관련된 choice 등록
    //만약 사진파일갯수 < 선택지 갯수일 경우 파일 나머지를 null로 채워야함
    let filename=[];
    data.choice.forEach(async(item, index)=>{
      if(files[index]) filename.push(files[index].filename)
      else filename.push(null);

      await models.Choice.create({
        choice_id: index + 1,
        post_id: post_id,
        choice_content: item,
        photo_url: filename[index],
      })
    })
  }
}