import passport from 'passport';

export const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error de autenticación',
                details: err.message
            });
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Token inválido o expirado',
                info: info?.message || 'Usuario no encontrado'
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`,
                currentRole: req.user.role
            });
        }

        next();
    };
};

export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Usuario no autenticado'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado. Solo administradores pueden realizar esta acción',
            currentRole: req.user.role
        });
    }

    next();
};

export const requireUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Usuario no autenticado'
        });
    }

    if (req.user.role !== 'user') {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado. Solo usuarios pueden realizar esta acción',
            currentRole: req.user.role
        });
    }

    next();
};

export const verifyCartOwnership = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Usuario no autenticado'
        });
    }

    const cartId = req.params.cid;
    const userCartId = req.user.cart?._id || req.user.cart;

    if (req.user.role === 'admin') {
        return next();
    }

    if (userCartId && userCartId.toString() === cartId) {
        return next();
    }

    return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado. Solo puedes acceder a tu propio carrito',
        userCart: userCartId,
        requestedCart: cartId
    });
};

export const authenticateHybrid = (req, res, next) => {

    if (req.headers.authorization) {
        return passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error de autenticación JWT',
                    details: err.message
                });
            }

            if (user) {
                req.user = user;
                return next();
            }

            if (req.session.userId) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token JWT inválido y sesión no soportada en esta ruta'
                });
            }

            return res.status(401).json({
                status: 'error',
                message: 'Autenticación requerida',
                info: info?.message
            });
        })(req, res, next);
    }

    if (req.session.userId) {
        return res.status(401).json({
            status: 'error',
            message: 'Se requiere autenticación JWT para esta ruta'
        });
    }

    return res.status(401).json({
        status: 'error',
        message: 'Autenticación requerida'
    });
};

export const authorizeProductManagement = (req, res, next) => {
    const method = req.method;

    if (method === 'GET') {
        return next();
    }

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Solo administradores pueden crear, actualizar o eliminar productos',
                currentRole: req.user.role,
                requiredRole: 'admin'
            });
        }
    }

    next();
};

export const authorizeCartManagement = (req, res, next) => {
    const method = req.method;

    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Usuario no autenticado'
        });
    }

    if (req.user.role === 'admin' && method === 'GET') {
        return next();
    }

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        if (req.user.role !== 'user') {
            return res.status(403).json({
                status: 'error',
                message: 'Solo usuarios pueden modificar carritos',
                currentRole: req.user.role,
                requiredRole: 'user'
            });
        }
    }

    next();
};