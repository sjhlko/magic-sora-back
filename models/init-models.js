import { User } from './user.js';
import { Post } from './post.js';
import { Choice } from './choice.js';
import { Comment } from './comment.js';
import { Tag } from './tag.js';
import { InterestedTag } from './interested_tag.js';
import { LikeByUser } from './like_by_user.js';
import { TagOfPost } from './tag_of_post.js';
import { VoteByUser } from './vote_by_user.js';

const models = {
  User: User,
  Post: Post,
  Choice: Choice,
  Comment: Comment,
  Tag: Tag,
  InterestedTag: InterestedTag,
  LikeByUser: LikeByUser,
  TagOfPost: TagOfPost,
  VoteByUser: VoteByUser,
};

const associate = () => {
  User.associate(models);
  Post.associate(models);
  Choice.associate(models);
  Comment.associate(models);
  Tag.associate(models);
};

export { models, associate };
