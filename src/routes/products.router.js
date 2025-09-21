import { Router } from 'express';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { ProductDTO, ProductListDTO } from '../dto/ProductDTO.js';
import {
    authenticateJWT,
    authorizeProductManagement
} from '../middlewares/authorization.js';

const router = Router();
const productRepository = new ProductRepository();

router.use(authenticateJWT);
router.use(authorizeProductManagement);

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
        };

        const searchQuery = query ? { category: query } : {};

        const result = await productRepository.getAllProducts(searchQuery, options);

        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}&query=${query || ''}&sort=${sort || ''}` : null;
        const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}&query=${query || ''}&sort=${sort || ''}` : null;

        res.status(200).json({
            status: 'success',
            payload: ProductListDTO.createArray(result.docs),
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
            user: req.user ? {
                id: req.user._id,
                role: req.user.role,
                email: req.user.email
            } : null
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los productos.',
            details: error.message
        });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productRepository.getProductById(pid);

        res.status(200).json({
            status: 'success',
            payload: ProductDTO.create(product)
        });
    } catch (error) {
        console.error("Error al obtener producto:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const productData = req.body;

        if (!productData.title || !productData.description || !productData.code ||
            productData.price === undefined || productData.stock === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Campos requeridos: title, description, code, price, stock'
            });
        }

        const newProduct = await productRepository.createProduct(productData);

        res.status(201).json({
            status: 'success',
            payload: ProductDTO.create(newProduct),
            message: 'Producto creado exitosamente'
        });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updates = req.body;

        delete updates._id;

        const updatedProduct = await productRepository.updateProduct(pid, updates);

        res.status(200).json({
            status: 'success',
            payload: ProductDTO.create(updatedProduct),
            message: 'Producto actualizado exitosamente'
        });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        const statusCode = error.message.includes('not found') ? 404 : 400;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await productRepository.deleteProduct(pid);

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;