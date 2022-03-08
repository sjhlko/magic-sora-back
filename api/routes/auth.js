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
  //닉네임,이메일을 버튼을 눌러서 중복확인시 user api에서 확인

  //로컬 회원가입(중복확인을 하지않고 회원가입 요청시)
  route.post(
    '/register/local',
    middlewares.isEmailExists,
    middlewares.isNicknameExists,
    wrapAsyncError(async (req, res) => {
      console.log(req.body);
      let account = null;
      account = await AuthServiceInstance.localRegister(req.body);
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
