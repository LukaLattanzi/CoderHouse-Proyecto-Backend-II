import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const SECRET = process.env.SECRET_KEY || 'fallback-secret-key-para-desarrollo';

console.log('🔑 JWT Utils - SECRET cargado:', SECRET ? 'Sí' : 'No');
console.log('🔑 JWT Utils - SECRET length:', SECRET?.length || 0);
console.log('🎯 JWT Utils - SECRET preview:', SECRET?.substring(0, 10) + '...' || 'undefined');

export function signJwt(payload, expiresIn = '15m') {
  console.log('🔐 Generando JWT con SECRET preview:', SECRET?.substring(0, 10) + '...');
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
