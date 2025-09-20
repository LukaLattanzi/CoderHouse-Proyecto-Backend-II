import { ProductModel } from '../models/product.model.js';

export class ProductDAO {
    async create(productData) {
        try {
            const product = new ProductModel(productData);
            return await product.save();
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            throw new Error(`Error finding product by ID: ${error.message}`);
        }
    }

    async findAll(query = {}, options = {}) {
        try {
            const { limit = 10, page = 1, sort } = options;
            const paginateOptions = {
                limit: parseInt(limit),
                page: parseInt(page),
                lean: true,
                sort: sort || { _id: 1 }
            };

            return await ProductModel.paginate(query, paginateOptions);
        } catch (error) {
            throw new Error(`Error finding products: ${error.message}`);
        }
    }

    async update(id, productData) {
        try {
            return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    async findByCategory(category) {
        try {
            return await ProductModel.find({ category });
        } catch (error) {
            throw new Error(`Error finding products by category: ${error.message}`);
        }
    }

    async findByStatus(status) {
        try {
            return await ProductModel.find({ status });
        } catch (error) {
            throw new Error(`Error finding products by status: ${error.message}`);
        }
    }

    async updateStock(id, quantity) {
        try {
            return await ProductModel.findByIdAndUpdate(
                id,
                { $inc: { stock: -quantity } },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error updating product stock: ${error.message}`);
        }
    }

    async checkStock(id, quantity) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product.stock >= quantity;
        } catch (error) {
            throw new Error(`Error checking product stock: ${error.message}`);
        }
    }
}