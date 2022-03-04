import config from '../config/index.js';
import transporter from '../library/mailer.js';
import { models } from '../models/init-models.js';

export class UserService {
  constructor() {}

  async getUserById(id) {
    return await models.User.findById(id);
  }

  async updateUser(id, user) {
    return await models.User.updateUser(id, user);
  }

  async deleteUser(id) {
    await models.User.deleteUser(id);

    // 관심 태그 삭제
    await models.InterestedTag.destroy({
      where: { user_id: id },
    });
    // 댓글 좋아요 삭제
    await models.LikeByUser.destroy({
      where: { user_id: id },
    });
  }

  async sendPasswordChangeEmail(id) {
    const user = await models.User.findWithAttribute(id, ['user_email']);

    await transporter.sendMail({
      from: `'Magic Soragodong' <${config.mailerUser}>`,
      to: user.user_email,
      subject: '🔮 마법의 익명고동 비밀번호 찾기',
      text: '비밀번호 찾기',
    });
  }

  async getUserPost(id) {
    const user = await models.User.findWithAttribute(id, [
      'user_id',
      'nickname',
    ]);
    let userPosts = await user.getPosts({
      attributes: ['post_id', 'post_title', 'register_date'],
    });

    userPosts = userPosts.map(async post => {
      let userPost = {
        postId: post.post_id,
        title: post.post_title,
        registerDate: post.register_date,
        author: user.nickname,
      };

      const tags = await post.getTags({
        attributes: ['tag_name'],
      });
      userPost.tags = tags.map(tag => {
        return tag.tag_name;
      });

      const thumbnail = await post.getChoices({
        attributes: ['photo_url'],
        limit: 1,
      });
      userPost.thumbnail = thumbnail[0].photo_url;

      const comments = await models.Comment.count({
        where: { post_id: post.post_id },
      });
      userPost.commentNum = comments;

      return userPost;
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
      const author = await models.User.findWithAttribute(id, ['nickname']);

      let votePost = {
        postId: post.post_id,
        title: post.post_title,
        registerDate: post.register_date,
        author: author.nickname,
      };

      const tags = await post.getTags({
        attributes: ['tag_name'],
      });
      votePost.tags = tags.map(tag => {
        return tag.tag_name;
      });

      const thumbnail = await post.getChoices({
        attributes: ['photo_url'],
        limit: 1,
      });
      votePost.thumbnail = thumbnail[0].photo_url;

      const comments = await models.Comment.count({
        where: { post_id: post.post_id },
      });
      votePost.commentNum = comments;

      return votePost;
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

  /**
   *
   * @param {*} userId
   * @param {*} tagId
   * @todo 수정할 태그 리스트 받아서 한 번에 수정
   */
  async addUserTag(userId, tagId) {
    const user = await models.User.findWithAttribute(userId, ['user_id']);
    const tag = await models.Tag.findOne({
      attributes: ['tag_id'],
      where: { tag_id: tagId },
    });

    await user.addTag(tag);
  }

  async deleteUserTag(userId, tagId) {
    await models.InterestedTag.destroy({
      where: [{ user_id: userId }, { tag_id: tagId }],
    });
  }
}
