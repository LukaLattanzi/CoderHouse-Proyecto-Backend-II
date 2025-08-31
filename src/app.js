import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import { engine } from 'express-handlebars';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import usersRouter from './routes/users.router.js';
import sessionsRouter from './routes/sessions.router.js';
import passport from 'passport';
import { ProductModel } from './models/product.model.js';
import { CartModel } from './models/cart.model.js';

await import('./middlewares/passport/passport-jwt.js');
import { requireAuth } from './middlewares/auth.js';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);
const PORT = 8080;
const MONGO_URL = process.env.MONGO_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    ttl: 14 * 24 * 60 * 60
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use('/api/carts', (req, res, next) => {
  if (!req.headers.authorization && !req.session.userId) {
    return res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
  }
  next();
});

/* app.use(async (req, res, next) => {
  if (!req.session.cartId) {
    try {
      const newCart = await CartModel.create({ products: [] });
      req.session.cartId = newCart._id.toString();
    } catch (error) {
      console.error('Error creando carrito para la sesión:', error);
    }
  }
  next();
}); */

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(passport.initialize());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

io.on('connection', async socket => {
  console.log('🟢 Cliente conectado');

  try {
    const products = await ProductModel.find().lean();
    socket.emit('productList', products);
  } catch (error) {
    console.error('Error al obtener productos para WebSocket:', error);
  }

  socket.on('addProduct', async product => {
    try {
      await ProductModel.create(product);
      const updatedProducts = await ProductModel.find().lean();
      io.emit('productList', updatedProducts);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  });

  socket.on('deleteProduct', async productId => {
    try {
      await ProductModel.findByIdAndDelete(productId);
      const updatedProducts = await ProductModel.find().lean();
      io.emit('productList', updatedProducts);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado');
  });
});

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ Conectado a la base de datos');
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("❌ Error de conexión a la base de datos:", error);
  });