import { Router } from 'express';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';
import { TicketModel } from '../models/ticket.model.js';
import { UserModel } from '../models/user.model.js';
import passport from 'passport';

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findOne({ _id: req.params.cid }).populate('products.product');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const product = await ProductModel.findById(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        console.log('🛒 Agregando producto al carrito:', { cartId: cid, productId: pid });

        const productIndex = cart.products.findIndex(item => item.product && item.product.toString() === pid);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
            console.log('📈 Incrementando cantidad del producto existente');
        } else {
            cart.products = cart.products.filter(item => item.product !== null);
            cart.products.push({ product: pid, quantity: 1 });
            console.log('🆕 Agregando nuevo producto al carrito');
        }

        await cart.save();
        console.log('💾 Carrito guardado en BD');

        const updatedCart = await CartModel.findById(cid).populate('products.product');
        console.log('✅ Carrito actualizado:', updatedCart.products.length, 'productos');

        res.status(200).json({ status: 'success', payload: updatedCart });

    } catch (error) {
        console.error('Error agregando producto al carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

const authenticateUser = (req, res, next) => {

    if (req.headers.authorization) {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err || !user) {
                return res.status(401).json({ status: 'error', message: 'Token JWT inválido' });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
    else if (req.session?.userId) {
        next();
    }
    else {
        return res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
    }
};

router.post('/:cid/purchase', authenticateUser, async (req, res) => {
    try {
        const { cid } = req.params;

        const userId = req.user?._id || req.session?.userId;

        const cart = await CartModel.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productsToPurchase = [];
        const productsToKeepInCart = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            if (!item.product) continue;

            if (item.product.stock >= item.quantity) {
                productsToPurchase.push(item);
                totalAmount += item.product.price * item.quantity;
                await ProductModel.updateOne(
                    { _id: item.product._id },
                    { $inc: { stock: -item.quantity } }
                );
            } else {
                productsToKeepInCart.push(item);
            }
        }

        if (productsToPurchase.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No hay productos con stock suficiente para realizar la compra.'
            });
        }

        const user = await UserModel.findById(userId);
        const purchaserEmail = user?.email || 'user@example.com';

        const ticketProducts = productsToPurchase.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        console.log('🎫 Creando ticket con:', {
            amount: totalAmount,
            purchaser: purchaserEmail,
            cart: cid,
            products: ticketProducts.length
        });

        const ticket = await TicketModel.create({
            amount: totalAmount,
            purchaser: purchaserEmail,
            cart: cid,
            products: ticketProducts
        });

        console.log('✅ Ticket creado:', ticket.code);

        const newCart = await CartModel.create({ products: [] });
        await UserModel.findByIdAndUpdate(userId, { cart: newCart._id });

        if (req.session?.userId) {
            req.session.cartId = newCart._id.toString();
        }

        cart.products = [];
        await cart.save();

        res.status(200).json({
            status: 'success',
            message: 'Compra realizada con éxito!',
            ticket: {
                code: ticket.code,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
                purchase_datetime: ticket.purchase_datetime,
                cart: ticket.cart,
                products: ticketProducts
            },
            newCartId: newCart._id,
            productsNotInStock: productsToKeepInCart.map(item => ({
                productId: item.product._id,
                title: item.product.title,
                requestedQuantity: item.quantity,
                availableStock: item.product.stock
            }))
        });

    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        if (!Array.isArray(products)) return res.status(400).json({ status: 'error', message: 'Formato de productos inválido' });

        const cart = await CartModel.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ status: 'error', message: 'La cantidad es inválida' });
        }

        const cart = await CartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        ).populate('products.product');

        if (!cart) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });

        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        let cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(item => item.product && item.product.toString() !== pid);
        await cart.save();

        const updatedCart = await CartModel.findById(cid).populate('products.product');
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;