import { Router } from 'express';
import { AuthService } from '../../services/auth.js';
import middlewares from '../middlewares/index.js';
import jwt from 'jsonwebtoken';
import {
  wrapAsyncError,
  verifyToken,
  generateToken,
  CustomError,
} from '../../library/index.js';
import { models } from '../../models/init-models.js';

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
      res.status(201).json(req.body);
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
      // res.cookie('refresh_token', refreshToken, {
      //   httpOnly: true,
      //   maxAge: 1000 * 60 * 60 * 24 * 14,
      // });
      res.status(200).send({
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    }),
  );

  //로그아웃
  route.post(
    '/logout',
    middlewares.isAuth,
    middlewares.getCurrentUserId,
    wrapAsyncError(async (req, res) => {
      //res.clearCookie('refresh_token');
      AuthServiceInstance.updateRefreshToken(req.user_id, null);
      res.status(200).json('로그아웃 성공');
    }),
  );

  //access token이 만료되어 refresh토큰을 비교함
  route.get(
    '/refresh',
    wrapAsyncError(async (req, res) => {
      const accessToken = req.headers.authorization.split(' ')[1];
      const refreshToken = req.headers.refresh;
      const decoded = verifyToken(accessToken);
      const userID = jwt.decode(accessToken).user_id;
      const user = await models.User.findById(userID, ['refresh_token']);

      //로그인이 되어있는지 확인
      if (user.refresh_token === null) {
        throw new CustomError('Json Web Token Error', '🔥 Login required', 401);
      }

      //console.log(decoded);

      if (decoded.message == 'jwt expired') {
        const decodedRefreshToken = verifyToken(refreshToken);
        //console.log(decodedRefreshToken, userID);
        //const user = await models.User.findById(userID, ['refresh_token']); //user db에 저장된 refresh token

        //RefreshToken이 만료된 경우
        if (decodedRefreshToken.message == 'jwt expired') {
          throw new CustomError(
            'Json Web Token Error',
            '🔥 Expired refresh token. (Login expired)',
            401,
          );
        }

        //RefreshToken이 만료되지 않은경우
        else {
          //RefreshToken이 올바른 경우
          if (refreshToken === user.refresh_token) {
            const newAccessToken = await generateToken({ user_id: userID });
            res.cookie('refresh_token', refreshToken, {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24 * 14,
            });
            return res.status(200).send({
              data: {
                access_token: newAccessToken,
              },
            });
          }
          //RefreshToken이 올바르지 않은 경우
          else {
            throw new CustomError(
              'Json Web Token Error',
              '🔥 Invalid refresh token',
              401,
            );
          }
        }
      }
    }),
  );
};
