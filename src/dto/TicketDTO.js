import { ProductCartDTO } from './ProductDTO.js';

export class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.products = ticket.products.map(item => ({
            product: ProductCartDTO.create(item.product),
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        }));
    }

    static create(ticket) {
        return new TicketDTO(ticket);
    }

    static createArray(tickets) {
        return tickets.map(ticket => new TicketDTO(ticket));
    }
}

export class TicketSummaryDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.itemCount = ticket.products.length;
    }

    static create(ticket) {
        return new TicketSummaryDTO(ticket);
    }

    static createArray(tickets) {
        return tickets.map(ticket => new TicketSummaryDTO(ticket));
    }
}

export class PurchaseResultDTO {
    constructor(result) {
        this.ticket = TicketDTO.create(result.ticket);
        this.purchasedProducts = result.purchasedProducts.map(item => ({
            product: ProductCartDTO.create(item.product),
            quantity: item.quantity,
            status: 'purchased'
        }));
        this.unavailableProducts = result.unavailableProducts.map(item => ({
            product: ProductCartDTO.create(item.product),
            quantity: item.quantity,
            status: 'unavailable',
            reason: item.reason
        }));
        this.partialPurchase = result.partialPurchase;
        this.summary = {
            totalPurchased: this.purchasedProducts.length,
            totalUnavailable: this.unavailableProducts.length,
            totalAmount: result.ticket.amount
        };
    }

    static create(result) {
        return new PurchaseResultDTO(result);
    }
}