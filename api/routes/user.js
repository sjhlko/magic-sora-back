import { Router } from 'express';
import { UserService } from '../../services/user.js';
import middlewares from '../middlewares/index.js';
const route = Router();
const userServiceInstance = new UserService();

export default app => {
  app.use('/users', route);

  // 프로필 정보 조회
  route.get('/:id', middlewares.isUserIdValid, async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await userServiceInstance.getUserById(id);

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
        const id = req.params.id;
        await userServiceInstance.sendPasswordChangeEmail(id);

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
        const id = req.params.id;
        let newUser = req.body;
        newUser = await userServiceInstance.updateUser(id, newUser);

        return res.json(newUser);
      } catch (err) {
        next(err);
      }
    },
  );

  // 회원 탈퇴
  route.delete('/:id', middlewares.isUserIdValid, async (req, res, next) => {
    try {
      const id = req.params.id;
      await userServiceInstance.deleteUser(id);

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
        const id = req.params.id;
        const userPosts = await userServiceInstance.getUserPost(id);

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
        const votePosts = await userServiceInstance.getVotePost(id);

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
        const userTags = await userServiceInstance.getUserTag(id);

        return res.json(userTags);
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
        const tagId = req.body;
        await userServiceInstance.addUserTag(userId, tagId);

        return res.status(201).json({ user_id: userId, tag_id: tagId });
      } catch (err) {
        next(err);
      }
    },
  );

  // 관심태그 삭제
  route.delete(
    '/:id/mytags',
    middlewares.isUserIdValid,
    async (req, res, next) => {
      try {
        const userId = req.params.id;
        const tagId = req.body;
        await userServiceInstance.deleteUserTag(userId, tagId);

        return res.sendStatus(204);
      } catch (err) {
        next(err);
      }
    },
  );
};
