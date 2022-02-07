import sequelizeLoader from './sequelize.js';

export default async app => {
  await sequelizeLoader();
};
