import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../../models/user.model.js';

const SECRET = process.env.SECRET_KEY || 'fallback-secret-key-para-desarrollo';

console.log('🔐 Passport JWT - SECRET configurado:', SECRET ? 'Sí' : 'No');
console.log('🔑 Passport JWT - SECRET length:', SECRET?.length || 0);
console.log('🎯 Passport JWT - SECRET preview:', SECRET?.substring(0, 10) + '...' || 'undefined');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
  passReqToCallback: false,
};

console.log('⚙️ Passport JWT - Opciones configuradas:', {
  secretProvided: !!opts.secretOrKey,
  extractorType: 'fromAuthHeaderAsBearerToken'
});

const verify = async (jwt_payload, done) => {
  try {
    console.log('🔍 Passport - Token recibido y decodificado correctamente');
    console.log('📦 Passport - Payload completo:', jwt_payload);
    console.log('🆔 Passport - Buscando usuario ID:', jwt_payload._id);

    const user = await UserModel.findById(jwt_payload._id).populate('cart').lean();

    if (!user) {
      console.log('❌ Passport - Usuario no encontrado en BD para ID:', jwt_payload._id);
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const { password, ...safeUser } = user;
    console.log('✅ Passport - Usuario encontrado y autenticado:', safeUser.email);
    console.log('🛒 Passport - Cart ID:', safeUser.cart?._id || safeUser.cart);

    return done(null, safeUser);
  } catch (err) {
    console.error('💥 Passport - Error crítico en verificación:', err.message);
    console.error('🔥 Passport - Stack trace:', err.stack);
    return done(err, false);
  }
};

passport.use('jwt', new JwtStrategy(opts, verify));

export default passport;