import { ProductCartDTO } from './ProductDTO.js';

export class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            product: ProductCartDTO.create(item.product),
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity
        }));
        this.total = this.calculateTotal();
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }

    calculateTotal() {
        return this.products.reduce((total, item) => total + item.subtotal, 0);
    }

    static create(cart) {
        return new CartDTO(cart);
    }

    static createArray(carts) {
        return carts.map(cart => new CartDTO(cart));
    }
}

export class CartSummaryDTO {
    constructor(cart) {
        this.id = cart._id;
        this.itemCount = cart.products.length;
        this.total = cart.products.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    static create(cart) {
        return new CartSummaryDTO(cart);
    }
}