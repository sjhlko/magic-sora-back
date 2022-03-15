import { Router } from 'express';
import { models } from '../../models/init-models.js';
import { wrapAsyncError } from '../../library/index.js';
import { AuthService } from '../../services/auth.js';
import middlewares from '../middlewares/index.js';
const AuthServiceInstance = new AuthService();
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
      const account = await AuthServiceInstance.localRegister(req.body);
      const token = await AuthServiceInstance.generateToken(account.user_id);
      res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.body = account;
      return res.json(res.body);
    }),
  );

  route.post(
    '/login/local',
    wrapAsyncError(async (req, res) => {
      const { user_email, password } = req.body;
      const account = await AuthServiceInstance.getUserByEmail(user_email);
      AuthServiceInstance.loginConfirm(account, password);
      const token = await AuthServiceInstance.generateToken(account.user_id);
      res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.body = account;
      return res.json(res.body);
    }),
  );

  route.post('/logout', async (req, res) => {
    res.cookie('access_token', null, {
      maxAge: 0,
      httpOnly: true,
    });
    res.status = 204;
    return res.json('logout');
  });
};
