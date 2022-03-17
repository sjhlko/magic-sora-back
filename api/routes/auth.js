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
      const accessToken = await AuthServiceInstance.generateAccessToken(
        account.user_id,
      );
      const refreshToken = await AuthServiceInstance.generateRefreshToken();
      AuthServiceInstance.updateRefreshToken(account.user_id, refreshToken);
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.status(200).send({
        data: {
          refreshToken,
        },
      });
    }),
  );

  route.post(
    //로컬 로그인
    '/login/local',
    wrapAsyncError(async (req, res) => {
      const { user_email, password } = req.body;
      const account = await AuthServiceInstance.getUserByEmail(user_email);
      AuthServiceInstance.loginConfirm(account, password);
      const accessToken = await AuthServiceInstance.generateAccessToken(
        account.user_id,
      );
      const refreshToken = await AuthServiceInstance.generateRefreshToken();
      AuthServiceInstance.updateRefreshToken(account.user_id, refreshToken);
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.status(200).send({
        data: {
          refreshToken,
        },
      });
    }),
  );

  //로그아웃
  route.post('/logout', async (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json('로그아웃 성공');
  });
};
