import { Router } from 'express';
import { TicketRepository } from '../repositories/TicketRepository.js';
import { TicketDTO, TicketSummaryDTO } from '../dto/TicketDTO.js';
import {
    authenticateJWT,
    authorize,
    requireAdmin
} from '../middlewares/authorization.js';

const router = Router();
const ticketRepository = new TicketRepository();

router.use(authenticateJWT);

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await ticketRepository.validateTicketAccess(
            id,
            req.user.email,
            req.user.role
        );

        res.status(200).json({
            status: 'success',
            payload: TicketDTO.create(ticket)
        });
    } catch (error) {
        console.error("Error al obtener ticket:", error);
        const statusCode = error.message.includes('not found') ? 404 :
            error.message.includes('Access denied') ? 403 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/code/:code', async (req, res) => {
    try {
        const { code } = req.params;

        const ticket = await ticketRepository.getTicketByCode(code);

        if (req.user.role !== 'admin' && ticket.purchaser !== req.user.email) {
            return res.status(403).json({
                status: 'error',
                message: 'Acceso denegado. Solo puedes ver tus propios tickets'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: TicketDTO.create(ticket)
        });
    } catch (error) {
        console.error("Error al obtener ticket por código:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/user/my-tickets', async (req, res) => {
    try {
        const tickets = await ticketRepository.getTicketsByPurchaser(req.user.email);

        res.status(200).json({
            status: 'success',
            payload: TicketSummaryDTO.createArray(tickets),
            count: tickets.length
        });
    } catch (error) {
        console.error("Error al obtener tickets del usuario:", error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/', requireAdmin, async (req, res) => {
    try {
        const { limit = 10, page = 1, startDate, endDate } = req.query;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page)
        };

        let tickets;

        if (startDate && endDate) {
            tickets = await ticketRepository.getTicketsByDateRange(
                new Date(startDate),
                new Date(endDate)
            );
        } else {
            tickets = await ticketRepository.getAllTickets({}, options);
        }

        res.status(200).json({
            status: 'success',
            payload: TicketSummaryDTO.createArray(tickets),
            count: tickets.length
        });
    } catch (error) {
        console.error("Error al obtener todos los tickets:", error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/reports/sales', requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                status: 'error',
                message: 'Fechas de inicio y fin son requeridas'
            });
        }

        const report = await ticketRepository.getSalesReport(
            new Date(startDate),
            new Date(endDate)
        );

        res.status(200).json({
            status: 'success',
            payload: report
        });
    } catch (error) {
        console.error("Error al generar reporte de ventas:", error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        delete updates.code;
        delete updates.purchase_datetime;
        delete updates.cart;

        const updatedTicket = await ticketRepository.updateTicket(id, updates);

        res.status(200).json({
            status: 'success',
            payload: TicketDTO.create(updatedTicket),
            message: 'Ticket actualizado exitosamente'
        });
    } catch (error) {
        console.error("Error al actualizar ticket:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await ticketRepository.deleteTicket(id);

        res.status(200).json({
            status: 'success',
            message: 'Ticket eliminado exitosamente'
        });
    } catch (error) {
        console.error("Error al eliminar ticket:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;