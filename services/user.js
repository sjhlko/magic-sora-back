import { models } from '../models/init-models.js';
import {
  createTransporter,
  sendMail,
  hashPassword,
  CustomError,
  generateToken,
  verifyToken,
} from '../library/index.js';
import config from '../config/index.js';

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

  async updateUser(id, currentPass, newUser) {
    if (currentPass) {
      currentPass = hashPassword(currentPass);
      const user = await models.User.findById(id, ['password']);

      if (currentPass !== user.password) {
        throw new CustomError(
          'Password Invalid',
          '🔥 Current Password Incorrect',
          403,
        );
      }

      newUser.password = hashPassword(newUser.password);
    }

    await models.User.updateUser(id, newUser);
    return await models.User.findById(id, this.userAttributes);
  }

  async deleteUser(id) {
    await models.User.deleteUser(id);

    // 관심 태그 삭제
    await models.InterestedTag.deleteAllTags(id);
    // 댓글 좋아요 삭제
    await models.LikeByUser.deleteAllLikes(id);
  }

  async sendResetPasswordEmail(user) {
    const transporter = await createTransporter();
    const secret = user.password + '_' + new Date().getDate();
    const resetToken = await generateToken({ id: user.user_id }, secret);
    const link = `${config.clientURL}/reset-password?code=${resetToken}&id=${user.user_id}`;

    await sendMail(transporter, user, link);
    return resetToken;
  }

  async resetPassword(user, resetToken, newPassword) {
    const secret = user.password + '_' + new Date().getDate();
    const decoded = verifyToken(resetToken, secret);

    if (decoded.id != user.user_id) {
      throw new CustomError(
        'Bad Request',
        '🔥 User Id Differ with Token Id',
        400,
      );
    }

    newPassword = hashPassword(newPassword);
    await models.User.updateUser(user.user_id, { password: newPassword });
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
    const user = await models.User.findWithModel(
      id,
      models.Post,
      ['post_id', 'user_id', 'post_title', 'register_date'],
      [models.Post, 'register_date', 'ASC'],
    );
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
      return await models.Tag.findById(id.tag_id);
    });
    tags = await Promise.all(tags);

    await user.addTags(tags);
  }

  async deleteUserTag(userId, tagId) {
    tagId.forEach(async id => {
      await models.InterestedTag.deleteOneTag(userId, id.tag_id);
    });
  }
}
