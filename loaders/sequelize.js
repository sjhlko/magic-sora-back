import sequelize from '../models/index.js';

export default async () => {
  const db = await sequelize();

  try {
    await db.sync({ force: false });
    console.log('Connecting database success!');
  } catch (error) {
    console.error('Connecting database fail!', error);
  }
};
