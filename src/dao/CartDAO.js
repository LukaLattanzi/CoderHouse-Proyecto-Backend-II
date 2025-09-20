import { CartModel } from '../models/cart.model.js';

export class CartDAO {
    async create(cartData = { products: [] }) {
        try {
            const cart = new CartModel(cartData);
            return await cart.save();
        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await CartModel.findById(id).populate('products.product');
        } catch (error) {
            throw new Error(`Error finding cart by ID: ${error.message}`);
        }
    }

    async findAll() {
        try {
            return await CartModel.find().populate('products.product');
        } catch (error) {
            throw new Error(`Error finding all carts: ${error.message}`);
        }
    }

    async update(id, cartData) {
        try {
            return await CartModel.findByIdAndUpdate(id, cartData, { new: true }).populate('products.product');
        } catch (error) {
            throw new Error(`Error updating cart: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await CartModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting cart: ${error.message}`);
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            const existingProductIndex = cart.products.findIndex(
                p => p.product.toString() === productId
            );

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            return await cart.save();
        } catch (error) {
            throw new Error(`Error adding product to cart: ${error.message}`);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            return await CartModel.findByIdAndUpdate(
                cartId,
                { $pull: { products: { product: productId } } },
                { new: true }
            ).populate('products.product');
        } catch (error) {
            throw new Error(`Error removing product from cart: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await CartModel.findOneAndUpdate(
                { _id: cartId, 'products.product': productId },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            ).populate('products.product');
        } catch (error) {
            throw new Error(`Error updating product quantity in cart: ${error.message}`);
        }
    }

    async clearCart(cartId) {
        try {
            return await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error clearing cart: ${error.message}`);
        }
    }

    async getCartTotal(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Cart not found');
            }

            return cart.products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        } catch (error) {
            throw new Error(`Error calculating cart total: ${error.message}`);
        }
    }
}