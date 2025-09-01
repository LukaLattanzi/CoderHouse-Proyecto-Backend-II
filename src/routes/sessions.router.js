import { Router } from 'express';
import passport from 'passport';
import { UserModel } from '../models/user.model.js';
import { CartModel } from '../models/cart.model.js';
import { isValidPassword, hashPassword } from '../utils/crypto.js';
import { signJwt } from '../utils/jwt.js';

const router = Router();

router.post('/web-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: 'Email y contraseña son requeridos'
            });
        }

        const user = await UserModel.findOne({ email }).populate('cart');
        if (!user || !isValidPassword(password, user.password)) {
            return res.render('login', {
                title: 'Iniciar Sesión',
                error: 'Credenciales inválidas'
            });
        }

        req.session.userId = user._id;
        req.session.userEmail = user.email;

        res.redirect('/products');
    } catch (err) {
        console.error('Error en login web:', err);
        res.render('login', {
            title: 'Iniciar Sesión',
            error: 'Error interno del servidor'
        });
    }
});

router.post('/web-register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, confirmPassword } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.render('register', {
                title: 'Crear Cuenta',
                error: 'Todos los campos son obligatorios'
            });
        }

        if (password !== confirmPassword) {
            return res.render('register', {
                title: 'Crear Cuenta',
                error: 'Las contraseñas no coinciden'
            });
        }

        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.render('register', {
                title: 'Crear Cuenta',
                error: 'El email ya está registrado'
            });
        }

        // Crear carrito y usuario
        const cart = await CartModel.create({ products: [] });
        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            age: parseInt(age),
            password: hashPassword(password),
            cart: cart._id,
            role: 'user'
        });

        req.session.userId = user._id;
        req.session.userEmail = user.email;

        res.redirect('/products');
    } catch (err) {
        console.error('Error en registro web:', err);
        res.render('register', {
            title: 'Crear Cuenta',
            error: 'Error interno del servidor'
        });
    }
});

router.post('/register', async (req, res) => {
    console.log('🚀 Endpoint /api/sessions/register alcanzado');
    console.log('📦 Body recibido:', req.body);
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos los campos son requeridos'
            });
        }

        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.status(400).json({
                status: 'error',
                message: 'El usuario ya existe'
            });
        }

        const cart = await CartModel.create({ products: [] });
        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            age: parseInt(age),
            password: hashPassword(password),
            cart: cart._id
        });

        res.status(201).json({
            status: 'success',
            message: 'Usuario creado exitosamente',
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                cart: user.cart
            }
        });
    } catch (err) {
        console.error('Error en registro API:', err);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

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

router.get('/current', (req, res, next) => {
    console.log('🔍 /current - Iniciando autenticación con Passport');
    console.log('📋 /current - Headers:', req.headers.authorization ? 'Authorization presente' : 'Authorization faltante');

    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        console.log('🎯 /current - Resultado de Passport:', {
            error: err ? err.message : null,
            userFound: !!user,
            info: info
        });

        if (err) {
            console.error('💥 /current - Error en Passport:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Error interno de autenticación',
                details: err.message
            });
        }

        if (!user) {
            console.log('❌ /current - Passport no autenticó el usuario');
            return res.status(401).json({
                status: 'error',
                message: 'Token inválido o expirado',
                info: info?.message || 'Usuario no encontrado'
            });
        }

        console.log('✅ /current - Usuario autenticado exitosamente:', user.email);
        return res.json({
            status: 'success',
            payload: user
        });
    })(req, res, next);
});

router.get('/test', (req, res) => {
    res.json({ status: 'success', message: 'Sessions router funcionando' });
});

export default router;