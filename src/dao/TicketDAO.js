import { TicketModel } from '../models/ticket.model.js';

export class TicketDAO {
    async create(ticketData) {
        try {
            const ticket = new TicketModel(ticketData);
            return await ticket.save();
        } catch (error) {
            throw new Error(`Error creating ticket: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await TicketModel.findById(id)
                .populate('cart')
                .populate('products.product');
        } catch (error) {
            throw new Error(`Error finding ticket by ID: ${error.message}`);
        }
    }

    async findByCode(code) {
        try {
            return await TicketModel.findOne({ code })
                .populate('cart')
                .populate('products.product');
        } catch (error) {
            throw new Error(`Error finding ticket by code: ${error.message}`);
        }
    }

    async findByPurchaser(purchaser) {
        try {
            return await TicketModel.find({ purchaser })
                .populate('cart')
                .populate('products.product')
                .sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error finding tickets by purchaser: ${error.message}`);
        }
    }

    async findAll(query = {}, options = {}) {
        try {
            const { limit = 10, page = 1, sort = { purchase_datetime: -1 } } = options;

            return await TicketModel.find(query)
                .populate('cart')
                .populate('products.product')
                .sort(sort)
                .limit(limit)
                .skip((page - 1) * limit);
        } catch (error) {
            throw new Error(`Error finding tickets: ${error.message}`);
        }
    }

    async update(id, ticketData) {
        try {
            return await TicketModel.findByIdAndUpdate(id, ticketData, { new: true })
                .populate('cart')
                .populate('products.product');
        } catch (error) {
            throw new Error(`Error updating ticket: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await TicketModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting ticket: ${error.message}`);
        }
    }

    async findByDateRange(startDate, endDate) {
        try {
            return await TicketModel.find({
                purchase_datetime: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
                .populate('cart')
                .populate('products.product')
                .sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error finding tickets by date range: ${error.message}`);
        }
    }

    async getTotalSales(startDate, endDate) {
        try {
            const result = await TicketModel.aggregate([
                {
                    $match: {
                        purchase_datetime: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        totalTickets: { $sum: 1 }
                    }
                }
            ]);

            return result[0] || { totalAmount: 0, totalTickets: 0 };
        } catch (error) {
            throw new Error(`Error calculating total sales: ${error.message}`);
        }
    }
}