import config from '../config/index.js';
import { models } from '../models/init-models.js';
import {
  createTransporter,
  hashPassword,
  CustomError,
} from '../library/index.js';

export class CommentService {
  async getAllComments(post_id) {
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
    return { comments };
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
    const user = await models.LikeByUser.findLikes(
      user_id,
      post_id,
      comment_id,
    );

    if (user) {
      throw new CustomError('Bad Request', '🔥 이미 좋아요를 눌렀습니다.', 403);
    } else {
      //like_by_user 테이블 행 추가
      await models.LikeByUser.create({
        user_id: user_id,
        post_id: post_id,
        comment_id: comment_id,
      });

      //comment 테이블 like수 업데이트(+1)
      await models.Comment.addLikes(comment_id);
    }
  }
  async deleteLikes(user_id, post_id, comment_id) {
    const user = await models.LikeByUser.findLikes(
      user_id,
      post_id,
      comment_id,
    );

    if (!user) {
      throw new CustomError('Bad Request', '🔥 취소할 좋아요가 없습니다.', 403);
    } else {
      //like_by_user 테이블 행 삭제
      await models.LikeByUser.destroy({
        where: {
          user_id: user_id,
          post_id: post_id,
          comment_id: comment_id,
        },
      });
      //comment 테이블 like수 업데이트(-1)
      await models.Comment.deleteLikes(comment_id);
    }
  }
  async getMyLikes(post_id, user_id) {
    const likes = await models.LikeByUser.findAll({
      where: {
        post_id: post_id,
        user_id: user_id,
      },
    });

    return likes;
  }
}
