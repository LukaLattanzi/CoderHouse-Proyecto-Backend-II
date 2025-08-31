import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET_KEY;

export function signJwt(payload, expiresIn = '15m') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
