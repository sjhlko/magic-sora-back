import sequelizeLoader from './sequelize.js';
import expressLoader from './express.js';
import logger from './logger.js';

export default app => {
  sequelizeLoader();
  logger.info('🌟 Sequelize connected');
  expressLoader(app);
  logger.info('🌟 Express server loaded');
};
