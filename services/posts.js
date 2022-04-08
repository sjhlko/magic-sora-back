import config from '../config/index.js';
import { models } from '../models/init-models.js';
import {
  createTransporter,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class PostService {
  async getPostList(type, id) {
    let posts;
    if (type == 'new') {
      posts = await models.Post.getNewPost();
    } else if (type == 'deadline') {
      posts = await models.Post.getDeadlinePost();
    } else if (type == 'end') {
      posts = await models.Post.getEndPost();
    } else if (type == 'hot') {
      posts = await models.Post.getHotPost();
    } else if (type == 'favtag') {
      const user = await models.User.findById(id, ['user_id']);
      let tags = await user.getTags();
      tags = tags.map(tag => {
        return tag.tag_id;
      });
      let post_id = await models.TagOfPost.findAll({ where: { tag_id: tags } });
      post_id = post_id.map(post_id => {
        return post_id.post_id;
      });
      post_id = Array.from(new Set(post_id));
      posts = await models.Post.getFavTagPost(post_id);
    }

    posts = posts.map(async post => {
      const author = await models.User.findById(post.user_id, [
        'nickname',
        'profile_pic_url',
      ]);
      const authorName = author ? author.nickname : '알 수 없음';
      const profile = author ? author.profile_pic_url : 'default image';
      return post.getPostInfo(authorName, profile);
    });
    posts = await Promise.all(posts);

    return posts;
  }

  async deletePost(id) {
    await models.VoteByUser.deleteVoteByUser(id);
    await models.Choice.deleteChoice(id);
    await models.Comment.deleteComment(id);
    await models.TagOfPost.deleteTagOfPost(id);
    await models.Post.deletePost(id);
  }

  async searchPost(option, search) {
    let posts;
    search = '%' + search.replace(' ', '%') + '%';
    if (option == 'nickname') {
      const author = await models.User.findByNickname(search, [
        'user_id',
        'nickname',
        'profile_pic_url',
      ]);
      const authorName = author ? author.nickname : '알 수 없음';
      const profile = author ? author.profile_pic_url : 'default image';
      posts = await author.getPosts();
      posts = posts.map(async post => {
        return post.getPostInfo(authorName, profile);
      });
    } else {
      if (option == 'post_title') {
        posts = await models.Post.searchPostTitle(search);
      } else if (option == 'post_content') {
        posts = await models.Post.searchPostContent(search);
      }
      posts = posts.map(async post => {
        const author = await models.User.findById(post.user_id, [
          'nickname',
          'profile_pic_url',
        ]);
        const profile = author ? author.profile_pic_url : 'default image';
        const authorName = author ? author.nickname : '알 수 없음';
        return post.getPostInfo(authorName, profile);
      });
    }
    posts = await Promise.all(posts);
    return posts;
  }
  async getPostDetail(id) {
    let post = await models.Post.getPostById(id);
    const author = await models.User.findById(post.user_id, [
      'nickname',
      'profile_pic_url',
    ]);
    const authorName = author ? author.nickname : '알 수 없음';
    const profile = author ? author.profile_pic_url : 'default image';

    post = post.getPostDetailInfo(authorName, profile);
    return post;
  }

  async insertPost(data, user_id) {
    const register_date = new Date();
    await models.Post.create({
      user_id: user_id,
      post_title: data.post_title,
      post_content: data.post_content,
      register_date: register_date,
      finish_date: data.finish_date,
    });
    //게시글 등록 시 post_id를 구하는 쿼리
    const getPostId = await models.Post.getLatestPost();
    let post_id = getPostId.post_id;

    //TagOfPost에 post와 관련된 tag 등록
    data.tag.forEach(async item => {
      await models.TagOfPost.create({
        post_id: post_id,
        tag_id: item,
      });
    });

    //Choice에 post와 관련된 choice 등록
    //choice 배열 객체로 보내줘
    data.choice.forEach(async (item, index) => {
      await models.Choice.create({
        choice_id: index + 1,
        post_id: post_id,
        choice_content: item,
        photo_url: item.photo_url,
      });
    });
  }
}
