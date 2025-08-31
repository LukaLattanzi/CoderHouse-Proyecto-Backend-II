import { Router } from 'express';
import { UserModel } from '../models/user.model.js';
import { CartModel } from '../models/cart.model.js';
import { hashPassword } from '../utils/crypto.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
    }
    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(409).json({ status: 'error', message: 'Email ya registrado' });

    const cart = await CartModel.create({ products: [] });

    const user = await UserModel.create({
      first_name, last_name, email, age,
      password: hashPassword(password),
      cart: cart._id,
      role: role || undefined
    });

    return res.status(201).json({ status: 'success', payload: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Error al crear usuario' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find().select('-password').populate('cart').lean();
    return res.json({ status: 'success', payload: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Error al listar usuarios' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password').populate('cart').lean();
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    return res.json({ status: 'success', payload: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Error al obtener usuario' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) data.password = hashPassword(data.password);
    const updated = await UserModel.findByIdAndUpdate(req.params.id, data, { new: true }).select('-password').lean();
    if (!updated) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    return res.json({ status: 'success', payload: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Error al actualizar usuario' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await UserModel.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    return res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Error al eliminar usuario' });
  }
});

export default router;
