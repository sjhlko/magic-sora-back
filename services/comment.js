import { models } from '../models/init-models.js';

export class CommentService {
  async getAllComments(post_id, user_id) {
    let bestComments = await models.Comment.getBestComments(post_id);
    let bestCommentId = [];
    bestComments = bestComments.map(async comment => {
      bestCommentId.push(comment.comment_id);
      return comment.getCommentInfo('best');
    });

    let restComments = await models.Comment.getRestComments(
      post_id,
      bestCommentId,
    );
    restComments = restComments.map(async comment => {
      return comment.getCommentInfo('common');
    });

    let comments = bestComments.concat(restComments);
    comments = await Promise.all(comments);

    let myLikes = await models.LikeByUser.findAll({
      where: {
        post_id: post_id,
        user_id: user_id,
      },
    });
    return { comments, myLikes };
  }

  async insertComment(post_id, user_id, data) {
    const register_date = new Date();
    await models.Comment.create({
      post_id: post_id,
      user_id: user_id,
      register_date: register_date,
      number_of_like: 0,
      comment_content: data.content,
    });
  }

  async deleteComment(user_id, post_id, comment_id) {
    await models.LikeByUser.destroy({
      where: { comment_id: comment_id, post_id: post_id },
    });
    await models.Comment.destroy({
      where: { comment_id: comment_id },
    });
  }

  async addLikes(user_id, post_id, comment_id) {
    await models.LikeByUser.create({
      user_id: user_id,
      post_id: post_id,
      comment_id: comment_id,
    });

    await models.Comment.addLikes(comment_id);
  }
  async deleteLikes(user_id, post_id, comment_id) {
    await models.LikeByUser.destroy({
      where: {
        user_id: user_id,
        post_id: post_id,
        comment_id: comment_id,
      },
    });
    await models.Comment.deleteLikes(comment_id);
  }
}
