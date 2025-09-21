import { Router } from 'express';
import { CartRepository } from '../repositories/CartRepository.js';
import { TicketRepository } from '../repositories/TicketRepository.js';
import { CartDTO } from '../dto/CartDTO.js';
import { PurchaseResultDTO } from '../dto/TicketDTO.js';
import {
    authenticateJWT,
    authorizeCartManagement,
    verifyCartOwnership
} from '../middlewares/authorization.js';

const router = Router();
const cartRepository = new CartRepository();
const ticketRepository = new TicketRepository();

router.use(authenticateJWT);
router.use(authorizeCartManagement);

router.get('/:cid', verifyCartOwnership, async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartRepository.getCartById(cid);

        res.status(200).json({
            status: 'success',
            payload: CartDTO.create(cart),
            user: {
                id: req.user._id,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error("Error al obtener carrito:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/products/:pid', verifyCartOwnership, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        console.log('🛒 Agregando producto al carrito:', {
            cartId: cid,
            productId: pid,
            quantity,
            userId: req.user._id
        });

        const updatedCart = await cartRepository.addProductToCart(cid, pid, quantity);

        res.status(200).json({
            status: 'success',
            payload: CartDTO.create(updatedCart),
            message: 'Producto agregado al carrito exitosamente'
        });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        const statusCode = error.message.includes('not found') ? 404 :
            error.message.includes('stock') ? 400 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid/products/:pid', verifyCartOwnership, async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'La cantidad debe ser un número positivo'
            });
        }

        const updatedCart = await cartRepository.updateProductQuantity(cid, pid, quantity);

        res.status(200).json({
            status: 'success',
            payload: CartDTO.create(updatedCart),
            message: 'Cantidad actualizada exitosamente'
        });
    } catch (error) {
        console.error("Error al actualizar cantidad:", error);
        const statusCode = error.message.includes('not found') ? 404 :
            error.message.includes('stock') ? 400 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid/products/:pid', verifyCartOwnership, async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const updatedCart = await cartRepository.removeProductFromCart(cid, pid);

        res.status(200).json({
            status: 'success',
            payload: CartDTO.create(updatedCart),
            message: 'Producto eliminado del carrito exitosamente'
        });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid', verifyCartOwnership, async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({
                status: 'error',
                message: 'El campo products debe ser un array'
            });
        }

        const updatedCart = await cartRepository.updateCart(cid, { products });

        res.status(200).json({
            status: 'success',
            payload: CartDTO.create(updatedCart),
            message: 'Carrito actualizado exitosamente'
        });
    } catch (error) {
        console.error("Error al actualizar carrito:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid', verifyCartOwnership, async (req, res) => {
    try {
        const { cid } = req.params;

        const clearedCart = await cartRepository.clearCart(cid);

        res.status(200).json({
            status: 'success',
            payload: CartDTO.create(clearedCart),
            message: 'Carrito vaciado exitosamente'
        });
    } catch (error) {
        console.error("Error al limpiar carrito:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/purchase', verifyCartOwnership, async (req, res) => {
    try {
        const { cid } = req.params;
        const userEmail = req.user.email;

        console.log('🎫 Iniciando proceso de compra:', {
            cartId: cid,
            userEmail: userEmail,
            userId: req.user._id
        });

        const purchaseResult = await ticketRepository.createTicket(cid, userEmail);

        console.log('✅ Compra procesada:', {
            ticketCode: purchaseResult.ticket.code,
            purchasedItems: purchaseResult.purchasedProducts.length,
            unavailableItems: purchaseResult.unavailableProducts.length,
            totalAmount: purchaseResult.ticket.amount
        });

        const statusCode = purchaseResult.partialPurchase ? 206 : 200;

        res.status(statusCode).json({
            status: 'success',
            payload: PurchaseResultDTO.create(purchaseResult),
            message: purchaseResult.partialPurchase
                ? 'Compra parcial realizada. Algunos productos no tenían stock suficiente'
                : 'Compra realizada exitosamente'
        });
    } catch (error) {
        console.error("Error al procesar compra:", error);
        const statusCode = error.message.includes('not found') ? 404 :
            error.message.includes('No products available') ? 400 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;