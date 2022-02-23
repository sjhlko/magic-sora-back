import { Router } from 'express';
import { models } from '../../models/init-models.js';
const route = Router();

export default app => {
  app.use('/users', route);

  // 프로필 정보 조회
  route.get('/:id', async (req, res) => {
    const user = await models.User.findOne({
      where: { user_id: req.params.id },
    });

    console.log('api success!: user profile', JSON.stringify(user, null, 2));
    return res.json(user);
  });

  // email, 닉네임 중복 조회
  route.get('/:id/exists', async (req, res) => {
    const type = req.query.type;
    const check = req.query.check;

    if (type == 'email') {
      const user = await models.User.findOne({
        where: { user_email: check },
      });
      if (user) {
        return res.json({
          isExists: true,
        });
      } else {
        return res.json({
          isExists: false,
        });
      }
    }

    if (type == 'nickName') {
      const user = await models.User.findOne({
        where: { nickname: check },
      });
      if (user) {
        return res.json({
          isExists: true,
        });
      } else {
        return res.json({
          isExists: false,
        });
      }
    }
  });

  // 프로필 정보 수정
  route.patch('/:id', async (req, res) => {
    const newUser = req.body;
    const user = await models.User.findOne({
      where: { user_id: req.params.id },
    });
    await user.update(newUser);

    return res.sendStatus(200);
  });

  // 회원 탈퇴
  route.delete('/:id', async (req, res) => {
    await models.User.destroy({
      where: { user_id: req.params.id },
    });

    return res.sendStatus(204);
  });

  // 작성한 고민 조회
  route.get('/:id/myposts', async (req, res) => {
    const user = await models.User.findOne({
      where: { user_id: req.params.id },
      attributes: ['user_id', 'nickname'],
    });
    let userPosts = await user.getPosts({
      attributes: ['post_id', 'post_title', 'register_date'],
    });

    userPosts = userPosts.map(async value => {
      let post = {
        postId: value.post_id,
        title: value.post_title,
        registerDate: value.register_date,
        author: user.nickname,
      };
      const tag = await value.getTags({
        attributes: ['tag_name'],
      });
      post.tags = tag.map(value => {
        return value.tag_name;
      });

      const thumbnail = await value.getChoices({
        attributes: ['photo_url'],
        limit: 1,
      });
      post.thumbnail = thumbnail[0].photo_url;

      const comments = await models.Comment.count({
        where: { post_id: value.post_id },
      });
      post.commentNum = comments;

      return post;
    });
    userPosts = await Promise.all(userPosts);

    console.log('api success!: user posts', userPosts);
    return res.json(userPosts);
  });

  // 투표한 고민 조회
  route.get('/:id/myvotes', async (req, res) => {
    const id = req.params.id;
    const user = await models.User.findOne({
      where: { user_id: id },
      attributes: ['user_id'],
      include: [
        {
          model: models.Post,
          attributes: ['post_id', 'user_id', 'post_title', 'register_date'],
          through: {
            where: { user_id: id },
          },
        },
      ],
    });
    let votePosts = user.Posts;

    votePosts = votePosts.map(async value => {
      let post = {
        postId: value.post_id,
        title: value.post_title,
        registerDate: value.register_date,
      };

      const author = await models.User.findOne({
        where: { user_id: value.user_id },
        attributes: ['nickname'],
      });
      post.author = author.nickname;

      const tag = await value.getTags({
        attributes: ['tag_name'],
      });
      post.tags = tag.map(value => {
        return value.tag_name;
      });

      const thumbnail = await value.getChoices({
        attributes: ['photo_url'],
        limit: 1,
      });
      post.thumbnail = thumbnail[0].photo_url;

      const comments = await models.Comment.count({
        where: { post_id: value.post_id },
      });
      post.commentNum = comments;

      return post;
    });
    votePosts = await Promise.all(votePosts);

    console.log('api success!: user votes', votePosts);
    return res.json(votePosts);
  });

  // 관심태그 조회
  route.get('/:id/mytags', async (req, res) => {
    const id = req.params.id;
    const user = await models.User.findOne({
      where: { user_id: id },
      include: [
        {
          model: models.Tag,
          through: {
            where: { user_id: id },
          },
        },
      ],
    });

    console.log(
      'api success!: user mytags',
      JSON.stringify(user.Tags, null, 2),
    );
    return res.json(user.Tags);
  });

  // 관심태그 추가
  route.post('/:id/mytags', async (req, res) => {
    const userId = req.params.id;
    const tagId = req.body.tagId;
    const tag = await models.Tag.findOne({
      attributes: ['tag_id'],
      where: { tag_id: tagId },
    });
    const user = await models.User.findOne({
      attributes: ['user_id'],
      where: { user_id: userId },
    });

    await user.addTag(tag);
    return res.sendStatus(201);
  });

  // 관심태그 삭제
  route.delete('/:id/mytags/:tagId', async (req, res) => {
    await models.InterestedTag.destroy({
      where: [{ user_id: req.params.id }, { tag_id: req.params.tagId }],
    });

    return res.sendStatus(204);
  });
};
