import sequelizeLoader from './sequelize.js';
import expressLoader from './express.js';

export default async expressApp => {
  await sequelizeLoader();
  expressLoader(expressApp);
};
