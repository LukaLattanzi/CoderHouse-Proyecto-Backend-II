import { Router } from 'express';
import { ProductModel } from '../models/product.model.js';
import { CartModel } from '../models/cart.model.js';
import { UserModel } from '../models/user.model.js';
import { requireAuth, redirectIfAuthenticated } from '../middlewares/auth.js';

const router = Router();

router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login', { title: 'Iniciar Sesión' });
});

router.get('/register', redirectIfAuthenticated, (req, res) => {
    res.render('register', { title: 'Crear Cuenta' });
});

router.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.redirect('/products');
});

router.get('/products', requireAuth, async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = { page: parseInt(page), limit: parseInt(limit), lean: true };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const searchQuery = query ? { category: query } : {};
        const result = await ProductModel.paginate(searchQuery, options);

        const user = await UserModel.findById(req.session.userId).populate('cart').lean();

        if (!user) {
            console.error('Usuario no encontrado en sesión:', req.session.userId);
            return res.redirect('/login');
        }

        if (!user.cart) {
            console.error('Usuario sin carrito asignado:', user._id);
            const newCart = await CartModel.create({ products: [] });
            await UserModel.findByIdAndUpdate(user._id, { cart: newCart._id });
            user.cart = newCart;
        }

        res.render('products', {
            title: 'Productos',
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null,
            user: {
                cartId: user.cart._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error al cargar la vista de productos:", error);
        res.status(500).render('error', { message: 'Error interno al cargar productos' });
    }
});

router.get('/products/:pid', requireAuth, async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid).lean();

        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        const user = await UserModel.findById(req.session.userId).populate('cart').lean();

        if (!user) {
            console.error('Usuario no encontrado en sesión:', req.session.userId);
            return res.redirect('/login');
        }

        if (!user.cart) {
            console.error('Usuario sin carrito asignado:', user._id);
            const newCart = await CartModel.create({ products: [] });
            await UserModel.findByIdAndUpdate(user._id, { cart: newCart._id });
            user.cart = newCart;
        }

        res.render('product-detail', {
            title: product.title,
            product,
            user: {
                cartId: user.cart._id,
                name: `${user.first_name} ${user.last_name}`
            }
        });
    } catch (error) {
        console.error("Error al cargar detalle del producto:", error);
        res.status(500).render('error', { message: 'Error interno al cargar la vista' });
    }
});

router.get('/carts/:cid', requireAuth, async (req, res) => {
    try {
        const { cid } = req.params;
        const user = await UserModel.findById(req.session.userId).populate('cart').lean();

        if (!user) {
            console.error('Usuario no encontrado en sesión:', req.session.userId);
            return res.redirect('/login');
        }

        if (!user.cart) {
            console.error('Usuario sin carrito asignado:', user._id);
            return res.status(403).render('error', { message: 'Carrito no encontrado para el usuario' });
        }

        if (user.cart._id.toString() !== cid) {
            return res.status(403).render('error', { message: 'Acceso denegado al carrito' });
        }

        const cart = await CartModel.findById(cid).populate('products.product').lean();

        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        res.render('cart', {
            title: 'Mi Carrito',
            cart,
            user: {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error al cargar vista del carrito:", error);
        res.status(500).render('error', { message: 'Error interno al cargar el carrito' });
    }
});

router.get('/logout', requireAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/login');
    });
});

export default router;