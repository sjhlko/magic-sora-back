const jwtSecret = process.env.JWT_SECRET;
import jwt from 'jsonwebtoken';

export function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: '7d',
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      },
    );
  });
}
