import { models } from '../models/init-models.js';
import { CustomError } from '../library/index.js';

export class ChoiceService {
  constructor() {}

  async voteChoice(userId, postId, choiceId) {
    const isVoted = await models.VoteByUser.getUserVote({
      userId,
      postId,
    });
    if (isVoted)
      throw new CustomError('Bad Request', '🔥 User Already voted', 400);

    await models.VoteByUser.create({
      post_id: postId,
      choice_id: choiceId,
      user_id: userId,
    });
  }

  async getPostChoices(postId, userId) {
    let myVote,
      isVoted = false;

    if (userId) {
      const vote = await models.VoteByUser.getUserVote({
        userId,
        postId,
      });
      isVoted = vote ? true : false;
      myVote = vote?.choice_id;
    }

    const post = await models.Post.getPostById(postId);
    let choices = await post.getChoices();
    choices = await Promise.all(
      choices.map(choice => {
        const { choice_id, choice_content, photo_url } = choice;
        return { choice_id, choice_content, photo_url };
      }),
    );

    return { isVoted, myVote, choices };
  }

  async getVoteResult(postId) {
    const post = await models.Post.getPostById(postId);
    const choices = await post.getChoices();

    let rank = await Promise.all(
      choices.map(async choice => {
        const choiceId = choice.choice_id;
        const votes = await models.VoteByUser.getChoiceScore({
          postId,
          choiceId,
        });
        return { choiceId, score: votes.length };
      }),
    );
    rank = rank.sort((a, b) => b.score - a.score);

    return rank;
  }
}
