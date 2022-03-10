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
      let token = null;
      token = await AuthServiceInstance.generateToken();
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
      let account = null;
      account = await AuthServiceInstance.getUserByEmail(user_email);
      if (!account) {
        //가입여부 확인
        return res.json('가입되어있지 않은 이메일');
      } else if (
        //비밀번호 비교
        !AuthServiceInstance.validatePassword(password, account.password)
      ) {
        res.status = 403;
        return res.json('비밀번호 오류');
      }
      let token = null;
      token = await AuthServiceInstance.generateToken();
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
