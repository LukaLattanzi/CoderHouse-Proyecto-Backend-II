import { TicketDAO } from '../dao/TicketDAO.js';
import { CartRepository } from './CartRepository.js';
import { ProductRepository } from './ProductRepository.js';

export class TicketRepository {
    constructor() {
        this.ticketDAO = new TicketDAO();
        this.cartRepository = new CartRepository();
        this.productRepository = new ProductRepository();
    }

    async createTicket(cartId, purchaserEmail) {
        try {

            const validation = await this.cartRepository.validateCartForPurchase(cartId);

            if (validation.availableProducts.length === 0) {
                throw new Error('No products available for purchase');
            }

            let totalAmount = 0;
            const purchasedProducts = [];

            for (const item of validation.availableProducts) {
                const product = item.product;
                const quantity = item.quantity;

                // Obtener el ID del producto correctamente
                const productId = product._id || product;

                await this.productRepository.updateStock(productId, quantity);

                purchasedProducts.push({
                    product: productId,
                    quantity: quantity,
                    price: product.price
                });

                totalAmount += product.price * quantity;
            }

            const ticketData = {
                cart: cartId,
                purchaser: purchaserEmail,
                amount: totalAmount,
                products: purchasedProducts
            };

            const ticket = await this.ticketDAO.create(ticketData);

            // Remover productos del carrito usando el ID correcto
            for (const item of validation.availableProducts) {
                const productId = item.product._id || item.product;
                await this.cartRepository.removeProductFromCart(cartId, productId.toString());
            }

            return {
                ticket,
                purchasedProducts: validation.availableProducts,
                unavailableProducts: validation.unavailableProducts,
                partialPurchase: validation.unavailableProducts.length > 0
            };

        } catch (error) {
            throw new Error(`Repository error creating ticket: ${error.message}`);
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await this.ticketDAO.findById(id);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            return ticket;
        } catch (error) {
            throw new Error(`Repository error finding ticket: ${error.message}`);
        }
    }

    async getTicketByCode(code) {
        try {
            const ticket = await this.ticketDAO.findByCode(code);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            return ticket;
        } catch (error) {
            throw new Error(`Repository error finding ticket by code: ${error.message}`);
        }
    }

    async getTicketsByPurchaser(purchaserEmail) {
        try {
            return await this.ticketDAO.findByPurchaser(purchaserEmail);
        } catch (error) {
            throw new Error(`Repository error finding tickets by purchaser: ${error.message}`);
        }
    }

    async getAllTickets(query = {}, options = {}) {
        try {
            return await this.ticketDAO.findAll(query, options);
        } catch (error) {
            throw new Error(`Repository error finding all tickets: ${error.message}`);
        }
    }

    async getTicketsByDateRange(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                throw new Error('Start date and end date are required');
            }

            if (startDate > endDate) {
                throw new Error('Start date cannot be after end date');
            }

            return await this.ticketDAO.findByDateRange(startDate, endDate);
        } catch (error) {
            throw new Error(`Repository error finding tickets by date range: ${error.message}`);
        }
    }

    async getSalesReport(startDate, endDate) {
        try {
            if (!startDate || !endDate) {
                throw new Error('Start date and end date are required');
            }

            const salesData = await this.ticketDAO.getTotalSales(startDate, endDate);
            const tickets = await this.ticketDAO.findByDateRange(startDate, endDate);

            return {
                period: {
                    startDate,
                    endDate
                },
                summary: {
                    totalSales: salesData.totalAmount,
                    totalTickets: salesData.totalTickets,
                    averageTicketValue: salesData.totalTickets > 0
                        ? salesData.totalAmount / salesData.totalTickets
                        : 0
                },
                tickets
            };
        } catch (error) {
            throw new Error(`Repository error generating sales report: ${error.message}`);
        }
    }

    async updateTicket(id, ticketData) {
        try {
            const ticket = await this.ticketDAO.findById(id);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            return await this.ticketDAO.update(id, ticketData);
        } catch (error) {
            throw new Error(`Repository error updating ticket: ${error.message}`);
        }
    }

    async deleteTicket(id) {
        try {
            const ticket = await this.ticketDAO.findById(id);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            return await this.ticketDAO.delete(id);
        } catch (error) {
            throw new Error(`Repository error deleting ticket: ${error.message}`);
        }
    }

    async validateTicketAccess(ticketId, userEmail, userRole) {
        try {
            const ticket = await this.ticketDAO.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            if (userRole === 'admin') {
                return ticket;
            }

            if (ticket.purchaser !== userEmail) {
                throw new Error('Access denied: You can only view your own tickets');
            }

            return ticket;
        } catch (error) {
            throw new Error(`Repository error validating ticket access: ${error.message}`);
        }
    }
}