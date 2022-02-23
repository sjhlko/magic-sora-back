import sequelizeLoader from './sequelize.js';
import expressLoader from './express.js';

export default app => {
  sequelizeLoader();
  expressLoader(app);
};
