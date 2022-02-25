import { associate } from '../models/init-models.js';
import sequelize from '../models/index.js';

export default () => {
  sequelize.sync({ force: false });
  associate();
};
