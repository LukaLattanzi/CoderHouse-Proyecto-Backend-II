import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../../models/user.model.js';

const SECRET = process.env.SECRET_KEY || 'fallback-secret-key-para-desarrollo';

console.log('🔐 Passport JWT SECRET cargado:', SECRET ? 'Sí' : 'No');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

const verify = async (jwt_payload, done) => {
  console.log('🎯 Passport JWT verify llamado con payload:', jwt_payload);
  try {
    const user = await UserModel.findById(jwt_payload._id).populate('cart').lean();
    if (!user) {
      console.log('❌ Usuario no encontrado en BD');
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    const { password, ...safeUser } = user;
    console.log('✅ Usuario autenticado:', safeUser.email);
    return done(null, safeUser);
  } catch (err) {
    console.log('💥 Error en verify:', err);
    return done(err, false);
  }
};

passport.use('jwt', new JwtStrategy(opts, verify));
passport.use('current', new JwtStrategy(opts, verify));

export default passport;
