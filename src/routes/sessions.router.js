import { Router } from 'express';
import passport from 'passport';
import { UserModel } from '../models/user.model.js';
import { isValidPassword } from '../utils/crypto.js';
import { signJwt } from '../utils/jwt.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email y password son requeridos' });
    }
    const user = await UserModel.findOne({ email }).populate('cart');
    if (!user) return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    if (!isValidPassword(password, user.password)) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const payload = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      cart: user.cart?._id || user.cart
    };

    const token = signJwt(payload, '1h');
    return res.json({ status: 'success', token, user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Error en login' });
  }
});

router.get('/current', passport.authenticate('current', { session: false }), async (req, res) => {
  return res.json({ status: 'success', user: req.user });
});

export default router;
