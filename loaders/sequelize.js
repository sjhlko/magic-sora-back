import { sequelize } from '../models/index.js';
import { associate } from '../models/init-models.js';

export default () => {
  sequelize.sync({ force: false });
  associate();
};
