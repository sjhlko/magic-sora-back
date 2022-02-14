import { sequelize } from '../models/index.js';
import { associate } from '../models/init-models.js';

export default async () => {
  try {
    // SQL DB 연결
    await sequelize.sync({ force: false });
    await associate();
    console.log('Connecting database success!');
  } catch (error) {
    console.error('Connecting database fail!', error);
  }
};
