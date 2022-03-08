import sequelize from 'sequelize';
import { CustomError } from '../library/index.js';

export default app => {
  app.use(function handleSequelizeError(error, req, res, next) {
    if (error instanceof sequelize.Error) {
      return res.status(503).json({
        type: 'SequelizeError',
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
