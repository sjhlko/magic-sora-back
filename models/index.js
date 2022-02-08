import Sequelize from 'sequelize';
import config from '../config/index.js';

export default {
  // logging => 쿼리문이 콘솔에 로그로 출력되는 것 비활성화
  sequelize: new Sequelize(config.databaseURL, { logging: true }),
};
