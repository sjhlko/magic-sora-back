import { User } from './user.js';
import { NonUser } from './non_user.js';
import { Post } from './post.js';
import { Choice } from './choice.js';
import { Comment } from './comment.js';
import { Tag } from './tag.js';
import { InterestedTag } from './interested_tag.js';
import { LikeByUser } from './like_by_user.js';
import { LikeByNonUser } from './like_by_non_user.js';
import { TagOfPost } from './tag_of_post.js';
import { VoteByUser } from './vote_by_user.js';
import { VoteByNonUser } from './vote_by_non_user.js';

const models = {
  User: User,
  NonUser: NonUser,
  Post: Post,
  Choice: Choice,
  Comment: Comment,
  Tag: Tag,
  InterestedTag: InterestedTag,
  LikeByUser: LikeByUser,
  LikeByNonUser: LikeByNonUser,
  TagOfPost: TagOfPost,
  VoteByUser: VoteByUser,
  VoteByNonUser: VoteByNonUser,
};

async function associate() {
  await User.associate(models);
  await NonUser.associate(models);
  await Post.associate(models);
  await Choice.associate(models);
  await Comment.associate(models);
  await Tag.associate(models);
}

export { models, associate };
