import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET_KEY || 'fallback-secret-key-para-desarrollo';

console.log('🔑 JWT SECRET cargado:', SECRET ? 'Sí' : 'No');

export function signJwt(payload, expiresIn = '15m') {
  console.log('🔐 Generando JWT con SECRET:', SECRET ? 'Definido' : 'Undefined');
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
