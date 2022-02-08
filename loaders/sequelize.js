import db from '../models/index.js';

export default async () => {
  try {
    // SQL DB 연결
    await db.sequelize.sync({ force: false });
    console.log('Connecting database success!');
  } catch (error) {
    console.error('Connecting database fail!', error);
  }
};
