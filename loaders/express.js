import route from '../api/index.js';
import config from '../config/index.js';

export default async app => {
  try {
    app.use(config.api.prefix, route());
    console.log('loading router success!');
  } catch (error) {
    console.error('loading router fail!', error);
  }
};
