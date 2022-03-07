import Sequelize from 'sequelize';
import config from '../config/index.js';

// logging => 쿼리문이 콘솔에 로그로 출력되는 것 비활성화
const sequelize = new Sequelize(config.databaseURL, { logging: false });

export default sequelize;
