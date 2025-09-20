import passport from 'passport';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

export const requireAuth = (req, res, next) => {
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }

    if (!req.session.userId) {
        return res.redirect('/login');
    }

    next();
};

export const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/products');
    }
    next();
};

// Middleware híbrido para vistas que soporta tanto JWT como sesiones
export const requireHybridAuth = async (req, res, next) => {
    try {
        // Excluir ciertas rutas
        if (req.path === '/login' || req.path === '/register') {
            return next();
        }

        // 1. Intentar JWT primero
        const token = req.headers.authorization?.replace('Bearer ', '') || 
                     req.cookies?.jwt_token;
        
        if (token) {
            try {
                const SECRET = process.env.SECRET_KEY || 'fallback-secret-key-para-desarrollo';
                const decoded = jwt.verify(token, SECRET);
                const user = await UserModel.findById(decoded._id).populate('cart').lean();
                
                if (user) {
                    req.user = user;
                    req.authMethod = 'jwt';
                    return next();
                }
            } catch (jwtError) {
                // Token inválido, continuar con sesión
            }
        }

        // 2. Fallback a sesión tradicional
        if (req.session.userId) {
            const user = await UserModel.findById(req.session.userId).populate('cart').lean();
            if (user) {
                req.user = user;
                req.authMethod = 'session';
                return next();
            }
        }

        // 3. No hay autenticación válida
        return res.redirect('/login');

    } catch (error) {
        console.error('Error en requireHybridAuth:', error);
        return res.redirect('/login');
    }
};