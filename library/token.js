import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function generateToken(payload, secret, expireTime) {
  const jwtSecret = secret || config.jwtSecret;
  const expireIn = expireTime || '600s';

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: expireIn,
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      },
    );
  });
}

export const verifyToken = (token, secret) => {
  const jwtSecret = secret || config.jwtSecret;
  return jwt.verify(token, jwtSecret);
};
