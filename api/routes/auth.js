import { Router } from 'express';
import { AuthService } from '../../services/auth.js';
import middlewares from '../middlewares/index.js';
import { wrapAsyncError } from '../../library/index.js';

const AuthServiceInstance = new AuthService();
const route = Router();

export default app => {
  app.use('/auth', route);

  route.post(
    '/register/local',
    wrapAsyncError(async (req, res) => {
      await AuthServiceInstance.localRegister(req.body);
      return res.sendStatus(201);
    }),
  );

  route.post(
    '/login/local',
    middlewares.isEmailValid,
    middlewares.isPasswordValid,
    wrapAsyncError(async (req, res) => {
      const account = req.user;
      const token = await AuthServiceInstance.localLogin(account.user_id);
      res.cookie('refresh', token.refresh, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14,
      });
      res.status(200).send({
        data: {
          access_token: token.access,
        },
      });
    }),
  );

  route.post(
    '/logout',
    middlewares.getToken,
    wrapAsyncError(async (req, res) => {
      await AuthServiceInstance.logout(req.accessToken);
      res.clearCookie('refresh');
      return res.sendStatus(200);
    }),
  );

  route.get(
    '/refresh',
    middlewares.getToken,
    wrapAsyncError(async (req, res) => {
      const newAccessToken = await AuthServiceInstance.refreshCheck(
        req.accessToken,
        req.refreshToken,
      );
      return res.status(200).send({
        data: {
          access_token: newAccessToken,
        },
      });
    }),
  );
};
