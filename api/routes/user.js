import { Router } from 'express';
import { models } from '../../models/init-models.js';
import config from '../../config/index.js';
import transporter from '../../library/mailer.js';
import middlewares from '../middlewares/index.js';
const route = Router();

export default app => {
  app.use('/users', route);

  // 프로필 정보 조회
  route.get('/:id', middlewares.isUserIdValid, async (req, res, next) => {
    try {
      const user = await models.User.findOne({
        where: { user_id: req.params.id },
      });

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  });

  route.get(
    '/:id/password',
    middlewares.isUserIdValid,
    async (req, res, next) => {
      try {
        const user = await models.User.findOne({
          where: { user_id: req.params.id },
          attributes: ['user_email'],
        });

        await transporter.sendMail({
          from: `'Magic Soragodong' <${config.mailerUser}>`,
          to: user.user_email,
          subject: '🔮 마법의 익명고동 비밀번호 찾기',
          text: '비밀번호 찾기',
        });

        return res.sendStatus(200);
      } catch (err) {
        next(err);
      }
    },
  );

  // email, 닉네임 중복 조회
  route.get(
    '/:id/nickname-exists',
    middlewares.isNicknameExists,
    async (req, res, next) => {
      try {
        return res.json({
          isExists: false,
        });
      } catch (err) {
        return next(err);
      }
    },
  );

  route.get(
    '/:id/email-exists',
    middlewares.isEmailExists,
    async (req, res, next) => {
      try {
        return res.json({
          isExists: false,
        });
      } catch (err) {
        next(err);
      }
    },
  );

  // 프로필 정보 수정
  route.patch(
    '/:id',
    middlewares.isUserIdValid,
    middlewares.isNicknameExists,
    async (req, res, next) => {
      try {
        const newUser = req.body;
        const user = await models.User.findOne({
          where: { user_id: req.params.id },
        });
        await user.update(newUser);

        return res.json(user);
      } catch (err) {
        next(err);
      }
    },
  );

  // 회원 탈퇴
  route.delete('/:id', middlewares.isUserIdValid, async (req, res, next) => {
    try {
      await models.User.destroy({
        where: { user_id: req.params.id },
      });

      return res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // 작성한 고민 조회
  route.get(
    '/:id/myposts',
    middlewares.isUserIdValid,
    async (req, res, next) => {
      try {
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

        return res.json(userPosts);
      } catch (err) {
        next(err);
      }
    },
  );

  // 투표한 고민 조회
  route.get(
    '/:id/myvotes',
    middlewares.isUserIdValid,
    async (req, res, next) => {
      try {
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

        return res.json(votePosts);
      } catch (err) {
        next(err);
      }
    },
  );

  // 관심태그 조회
  route.get(
    '/:id/mytags',
    middlewares.isUserIdValid,
    async (req, res, next) => {
      try {
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

        return res.json(user.Tags);
      } catch (err) {
        next(err);
      }
    },
  );

  // 관심태그 추가
  route.post(
    '/:id/mytags',
    middlewares.isUserIdValid,
    async (req, res, next) => {
      try {
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
        return res.status(201).json({ user_id: userId, tag_id: tagId });
      } catch (err) {
        next(err);
      }
    },
  );

  // 관심태그 삭제
  route.delete(
    '/:id/mytags/:tagId',
    middlewares.isUserIdValid,
    async (req, res, next) => {
      try {
        await models.InterestedTag.destroy({
          where: [{ user_id: req.params.id }, { tag_id: req.params.tagId }],
        });

        return res.sendStatus(204);
      } catch (err) {
        next(err);
      }
    },
  );
};
