import crypto from 'crypto';
import config from '../config/index.js';

const hashPassword = password => {
  return crypto
    .createHmac('sha256', config.hashSecret)
    .update(password)
    .digest('hex');
};

export { hashPassword };
