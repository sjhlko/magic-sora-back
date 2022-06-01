import Sequelize from 'sequelize';
import config from '../config/index.js';

const sequelize = new Sequelize(config.databaseURL, { logging: false });

export default sequelize;
