import sequelize from 'sequelize';
import jsonwebtoken from 'jsonwebtoken';
import { CustomError } from '../library/index.js';

export default app => {
  app.use(function handleSequelizeError(error, req, res, next) {
    if (error instanceof sequelize.Error) {
      return res.status(503).json({
        type: 'Sequelize Error',
        message: error.message,
      });
    }
    next(error);
  });

  app.use(function handleJWTError(error, req, res, next) {
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return res.status(401).json({
        type: 'Token Expired',
        message: error.message,
      });
    }
    if (error instanceof jsonwebtoken.JsonWebTokenError) {
      return res.status(401).json({
        type: 'Json Web Token Error',
        message: error.message,
      });
    }
    next(error);
  });

  app.use(function handleCustomError(error, req, res, next) {
    if (error instanceof CustomError) {
      const { type, status, message } = error;
      return res.status(status).json({
        type: type,
        message: message,
      });
    }
    next(error);
  });

  app.use(function (error, req, res, next) {
    res.status(400).json({ message: error.message });
  });
};
