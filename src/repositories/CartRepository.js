import { CartDAO } from '../dao/CartDAO.js';
import { ProductRepository } from './ProductRepository.js';

export class CartRepository {
    constructor() {
        this.cartDAO = new CartDAO();
        this.productRepository = new ProductRepository();
    }

    async createCart(cartData = { products: [] }) {
        try {
            return await this.cartDAO.create(cartData);
        } catch (error) {
            throw new Error(`Repository error creating cart: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.cartDAO.findById(id);
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw new Error(`Repository error finding cart: ${error.message}`);
        }
    }

    async getAllCarts() {
        try {
            return await this.cartDAO.findAll();
        } catch (error) {
            throw new Error(`Repository error finding all carts: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.cartDAO.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            await this.productRepository.getProductById(productId);
            await this.productRepository.validateStock(productId, quantity);

            return await this.cartDAO.addProduct(cartId, productId, quantity);
        } catch (error) {
            throw new Error(`Repository error adding product to cart: ${error.message}`);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.cartDAO.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            const productExists = cart.products.some(
                p => p.product._id.toString() === productId
            );

            if (!productExists) {
                throw new Error('Product not found in cart');
            }

            return await this.cartDAO.removeProduct(cartId, productId);
        } catch (error) {
            throw new Error(`Repository error removing product from cart: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            if (quantity <= 0) {
                return await this.removeProductFromCart(cartId, productId);
            }

            await this.productRepository.validateStock(productId, quantity);

            return await this.cartDAO.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            throw new Error(`Repository error updating product quantity: ${error.message}`);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await this.cartDAO.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            return await this.cartDAO.clearCart(cartId);
        } catch (error) {
            throw new Error(`Repository error clearing cart: ${error.message}`);
        }
    }

    async getCartTotal(cartId) {
        try {
            return await this.cartDAO.getCartTotal(cartId);
        } catch (error) {
            throw new Error(`Repository error calculating cart total: ${error.message}`);
        }
    }

    async validateCartForPurchase(cartId) {
        try {
            const cart = await this.cartDAO.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            if (cart.products.length === 0) {
                throw new Error('Cart is empty');
            }

            const stockValidations = [];
            const unavailableProducts = [];

            for (const item of cart.products) {
                try {
                    await this.productRepository.validateStock(item.product._id, item.quantity);
                    stockValidations.push({
                        product: item.product,
                        quantity: item.quantity,
                        available: true
                    });
                } catch (error) {
                    unavailableProducts.push({
                        product: item.product,
                        quantity: item.quantity,
                        available: false,
                        reason: error.message
                    });
                }
            }

            return {
                isValid: unavailableProducts.length === 0,
                availableProducts: stockValidations,
                unavailableProducts
            };
        } catch (error) {
            throw new Error(`Repository error validating cart for purchase: ${error.message}`);
        }
    }

    async updateCart(id, cartData) {
        try {
            const cart = await this.cartDAO.findById(id);
            if (!cart) {
                throw new Error('Cart not found');
            }

            return await this.cartDAO.update(id, cartData);
        } catch (error) {
            throw new Error(`Repository error updating cart: ${error.message}`);
        }
    }

    async deleteCart(id) {
        try {
            const cart = await this.cartDAO.findById(id);
            if (!cart) {
                throw new Error('Cart not found');
            }

            return await this.cartDAO.delete(id);
        } catch (error) {
            throw new Error(`Repository error deleting cart: ${error.message}`);
        }
    }
}