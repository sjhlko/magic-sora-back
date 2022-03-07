import { Router } from 'express';
import { models } from '../../models/init-models.js';
import Joi from 'joi';
const route = Router();

export default app => {
  app.use('/auth', route);

  route.post('/register/local', async (req, res) => {
    console.log(req.body);
    let account = null;
    try {
      console.log('try');
      account = await models.User.localRegister(req.body);
    } catch (e) {
      throw (500, e);
    }

    res.body = account;
    return res.json(res.body);
  });

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
