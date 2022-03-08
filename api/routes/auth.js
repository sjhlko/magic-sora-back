import { Router } from 'express';
import { models } from '../../models/init-models.js';
import { wrapAsyncError } from '../../library/index.js';
import { AuthService } from '../../services/auth.js';
import middlewares from '../middlewares/index.js';
const AuthServiceInstance = new AuthService();
import Joi from 'joi';
const route = Router();

export default app => {
  app.use('/auth', route);

  //회원가입시 이메일 중복 확인
  route.get(
    '/register/local/email-exists',
    middlewares.isEmailExists,
    wrapAsyncError(async (req, res) => {
      return res.json({
        isExists: false,
      });
    }),
  );

  //회원가입시 닉네임 중복 확인
  route.get(
    '/register/local/nickname-exists',
    middlewares.isNicknameExists,
    wrapAsyncError(async (req, res) => {
      return res.json({
        isExists: false,
      });
    }),
  );

  //로컬 회원가입
  route.post(
    '/register/local',
    middlewares.isEmailExists,
    middlewares.isNicknameExists,
    wrapAsyncError(async (req, res) => {
      console.log(req.body);

      let account = null;
      try {
        account = await AuthServiceInstance.localRegister(req.body);
      } catch (e) {
        throw (500, e);
      }

      res.body = account;
      return res.json(res.body);
    }),
  );

  route.post('/login/local', async (req, res) => {
    return res.json('login');
  });

  route.get('/exists/:key(email|username)/:value', async (req, res) => {
    return res.json('exits');
  });

  route.post('/logout', async (req, res) => {
    return res.json('logout');
  });
};
