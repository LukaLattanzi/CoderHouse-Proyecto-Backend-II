import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { ProductModel } from './models/product.model.js';
import { fileURLToPath } from 'url';

const MONGO_URL = 'mongodb+srv://ecommerceUser:ecommercePass123@cluster0.gmc2mli.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'; // Reemplaza con tu URL de conexión

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/products.json');

const seedDatabase = async () => {
    try {

        await mongoose.connect(MONGO_URL);
        console.log('✅ Conectado a MongoDB');

        await ProductModel.deleteMany({});
        console.log('🗑️ Colección de productos limpiada');

        const productsData = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(productsData);
        console.log(`📦 ${products.length} productos leídos del archivo JSON`);

        await ProductModel.insertMany(products);
        console.log('🌱 Productos insertados en la base de datos correctamente');

    } catch (error) {
        console.error('❌ Error durante el proceso de seeding:', error);
    } finally {

        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    }
};

seedDatabase();