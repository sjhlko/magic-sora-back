import { models } from '../models/init-models.js';
import { CustomError } from '../library/index.js';

export class ChoiceService {
  constructor() {}

  // 선택지 투표 순위대로 보여줌
  async getVoteResultAll(postId) {}

  // 해당 id 선택지 투표 현황 (mbit, gender, age)
  async getVoteResultOne(userId, postId, choiceId) {}

  // 해당 id 선택지 투표
  async voteChoice(userId, postId, choiceId) {
    const isVoted = await models.VoteByUser.getUserVote({
      user: userId,
      post: postId,
    });
    if (isVoted) {
      throw new CustomError('Bad Request', '🔥 Already Voted', 400);
    }

    const choice = await models.Choice.findById({
      post: postId,
      choice: choiceId,
    });
    if (!choice) {
      throw new CustomError('Not Found', '🔥 Choice Not Found', 404);
    }

    const post = await models.Post.getPostById(postId);
    const user = await models.User.findById(userId, ['user_id']);
    await post.addUser(user, { through: { choice_id: choiceId } });
  }
}
