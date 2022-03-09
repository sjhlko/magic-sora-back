import { models } from '../models/init-models.js';
import {
  createTransporter,
  sendMail,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class UserService {
  constructor() {
    this.userAttributes = [
      'user_id',
      'nickname',
      'birth_date',
      'gender',
      'mbti',
      'profile_pic_url',
    ];
  }

  async getUserById(id) {
    return await models.User.findById(id, this.userAttributes);
  }

  async updateUser(id, user) {
    if (user.password) {
      user.password = hashPassword(user.password);
    }

    await models.User.updateUser(id, user);
    return await models.User.findById(id, this.userAttributes);
  }

  async deleteUser(id) {
    await models.User.deleteUser(id);

    // 관심 태그 삭제
    await models.InterestedTag.deleteAllTags(id);
    // 댓글 좋아요 삭제
    await models.LikeByUser.deleteAllLikes(id);
  }

  async sendPasswordChangeEmail(id) {
    const user = await models.User.findById(id, ['user_email', 'nickname']);
    const transporter = await createTransporter();

    await sendMail(transporter, user);
  }

  async getUserPost(id) {
    const user = await models.User.findById(id, ['user_id', 'nickname']);
    let userPosts = await user.getMyPosts();

    userPosts = userPosts.map(async post => {
      return post.getPostInfo(user);
    });
    userPosts = await Promise.all(userPosts);

    return userPosts;
  }

  async getVotePost(id) {
    const user = await models.User.findWithModel(id, models.Post, [
      'post_id',
      'user_id',
      'post_title',
      'register_date',
    ]);
    let votePosts = user.Posts;

    votePosts = votePosts.map(async post => {
      const author = await models.User.findById(post.user_id, ['nickname']);
      return post.getPostInfo(author);
    });
    votePosts = await Promise.all(votePosts);

    return votePosts;
  }

  async getUserTag(id) {
    const user = await models.User.findWithModel(id, models.Tag, [
      'tag_id',
      'tag_name',
    ]);

    return user.Tags;
  }

  async addUserTag(userId, tagId) {
    const user = await models.User.findById(userId, ['user_id']);
    let tags = tagId.map(async id => {
      return await models.Tag.findById(id);
    });
    tags = await Promise.all(tags);

    await user.addTags(tags);
  }

  async deleteUserTag(userId, tagId) {
    tagId.forEach(async () => {
      await models.InterestedTag.deleteOneTag(userId, tagId);
    });
  }
}
