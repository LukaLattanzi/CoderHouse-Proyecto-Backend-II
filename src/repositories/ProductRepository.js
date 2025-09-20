import { ProductDAO } from '../dao/ProductDAO.js';

export class ProductRepository {
    constructor() {
        this.productDAO = new ProductDAO();
    }

    async createProduct(productData) {
        try {

            if (!productData.title || !productData.price || productData.stock === undefined) {
                throw new Error('Title, price, and stock are required');
            }

            if (productData.price <= 0) {
                throw new Error('Price must be greater than 0');
            }

            if (productData.stock < 0) {
                throw new Error('Stock cannot be negative');
            }

            const defaultData = {
                status: true,
                thumbnails: [],
                ...productData
            };

            return await this.productDAO.create(defaultData);
        } catch (error) {
            throw new Error(`Repository error creating product: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await this.productDAO.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Repository error finding product: ${error.message}`);
        }
    }

    async getAllProducts(query = {}, options = {}) {
        try {
            return await this.productDAO.findAll(query, options);
        } catch (error) {
            throw new Error(`Repository error finding products: ${error.message}`);
        }
    }

    async updateProduct(id, productData) {
        try {

            if (productData.price !== undefined && productData.price <= 0) {
                throw new Error('Price must be greater than 0');
            }

            if (productData.stock !== undefined && productData.stock < 0) {
                throw new Error('Stock cannot be negative');
            }

            const existingProduct = await this.productDAO.findById(id);
            if (!existingProduct) {
                throw new Error('Product not found');
            }

            return await this.productDAO.update(id, productData);
        } catch (error) {
            throw new Error(`Repository error updating product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await this.productDAO.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return await this.productDAO.delete(id);
        } catch (error) {
            throw new Error(`Repository error deleting product: ${error.message}`);
        }
    }

    async getProductsByCategory(category) {
        try {
            return await this.productDAO.findByCategory(category);
        } catch (error) {
            throw new Error(`Repository error finding products by category: ${error.message}`);
        }
    }

    async getAvailableProducts() {
        try {
            return await this.productDAO.findByStatus(true);
        } catch (error) {
            throw new Error(`Repository error finding available products: ${error.message}`);
        }
    }

    async validateStock(id, quantity) {
        try {
            const hasStock = await this.productDAO.checkStock(id, quantity);
            if (!hasStock) {
                throw new Error('Insufficient stock for this product');
            }
            return true;
        } catch (error) {
            throw new Error(`Repository error validating stock: ${error.message}`);
        }
    }

    async updateStock(id, quantity) {
        try {
            await this.validateStock(id, quantity);

            return await this.productDAO.updateStock(id, quantity);
        } catch (error) {
            throw new Error(`Repository error updating stock: ${error.message}`);
        }
    }

    async getProductsWithLowStock(threshold = 5) {
        try {
            return await this.productDAO.findAll({ stock: { $lte: threshold } });
        } catch (error) {
            throw new Error(`Repository error finding products with low stock: ${error.message}`);
        }
    }
}