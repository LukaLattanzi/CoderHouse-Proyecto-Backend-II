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