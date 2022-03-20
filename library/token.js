import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function generateToken(payload, secret, expireTime) {
  const jwtSecret = secret || config.jwtSecret;
  const expireIn = expireTime || '6s';

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        algorithm: 'HS256',
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
  try {
    const jwtSecret = secret || config.jwtSecret;
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

export function refreshToken(secret, expireTime) {
  const jwtSecret = secret || config.jwtSecret;
  const expireIn = expireTime || '14s';
  return jwt.sign({}, jwtSecret, {
    algorithm: 'HS256',
    expiresIn: expireIn,
  });
}
