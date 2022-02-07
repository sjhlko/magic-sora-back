import Sequelize from 'sequelize';
import config from '../config/index.js';

export default async () => {
  const sequelize = new Sequelize(config.databaseURL);
  return sequelize;
};
