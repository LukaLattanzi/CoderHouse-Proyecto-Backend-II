import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../../models/user.model.js';

const SECRET = process.env.SECRET_KEY || 'fallback-secret-key-para-desarrollo';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

const verify = async (jwt_payload, done) => {
  try {
    const user = await UserModel.findById(jwt_payload._id).populate('cart').lean();
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });
    const { password, ...safeUser } = user;
    return done(null, safeUser);
  } catch (err) {
    return done(err, false);
  }
};

passport.use('jwt', new JwtStrategy(opts, verify));
passport.use('current', new JwtStrategy(opts, verify));

export default passport;
