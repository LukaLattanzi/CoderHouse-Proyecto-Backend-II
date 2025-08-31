# 📦 Entrega Final: Backend Ecommerce

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-brightgreen.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue.svg)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-6.x-red.svg)](https://mongoosejs.com/)
[![Handlebars](https://img.shields.io/badge/Handlebars-Express-orange.svg)](https://handlebarsjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-blue.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)]()

---

## 📘 Descripción

Proyecto de backend para un ecommerce, desarrollado con Node.js, Express y MongoDB. Permite CRUD completo de productos y carritos, sistema completo de usuarios con autenticación JWT, vistas dinámicas con Handlebars, sesión de usuario y WebSockets para actualizaciones en tiempo real. Cumple con los requisitos de entrega final del bootcamp de backend e incluye autenticación y autorización completas.

---

## 🚀 Tecnologías

- Node.js + Express
- MongoDB Atlas con Mongoose y paginación (mongoose-paginate-v2)
- JWT + Passport + bcrypt para autenticación y seguridad
- express-session para sesión de usuario y carrito persistente
- Handlebars para vistas dinámicas en el frontend
- Socket.io para actualizaciones en tiempo real
- dotenv para manejo de variables de entorno

---

## 🛠 Características

### ✅ Sistema de Usuarios y Autenticación

- Registro y login con JWT
- Encriptación de contraseñas con bcrypt
- Middleware de autenticación con Passport
- Roles de usuario (user/admin)

### ✅ CRUD completo de Productos (/api/products)

- Paginación, filtrado (category o availability), ordenamiento (precio asc/desc)

### ✅ CRUD completo de Carritos (/api/carts)

- Agregar, eliminar, actualizar cantidades, vaciar carrito
- Sistema de compras con generación de tickets

### ✅ Persistencia con MongoDB

- Uso de populate para incluir datos completos de productos en carritos

### ✅ Vistas

- 🏠 / → listado de productos
- 📄 /products/:pid → detalle con botón “Agregar al carrito”
- 🛒 /carts/:cid → carrito con tabla de productos y botón de compra

### ✅ WebSocket para notificaciones en tiempo real

---

## ⚙️ Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/LukaLattanzi/CoderHouse-Proyecto-Backend-II
cd EntregaFinalMartin
```

Instalar dependencias:

```bash
npm install
```

Crear archivo .env en la raíz:

```dotenv
PORT=8080
MONGO_URL=<tu-string-de-conexión-de-mongodb-atlas>
SESSION_SECRET=<clave-secreta>
SECRET_KEY=<clave-secreta-jwt>
```

Iniciar la aplicación:

```bash
npm run dev
```

Abrir el navegador en:

```
http://localhost:8080
```

---

## 🔧 Endpoints REST

### Usuarios y Autenticación

```
POST   /api/users                 → Crear nuevo usuario
GET    /api/users                 → Obtener todos los usuarios
GET    /api/users/:id             → Obtener usuario por ID
PUT    /api/users/:id             → Actualizar usuario
DELETE /api/users/:id             → Eliminar usuario

POST   /api/sessions/login        → Login de usuario (genera JWT)
GET    /api/sessions/current      → Usuario actual (requiere JWT)
```

### Productos

```
GET    /api/products?limit=&page=&sort=&query=
GET    /api/products/:pid
POST   /api/products
PUT    /api/products/:pid
DELETE /api/products/:pid
```

### Carritos

```
GET    /api/carts/:cid
POST   /api/carts/:cid/product/:pid
POST   /api/carts/:cid/purchase          → Finalizar compra (genera ticket)
PUT    /api/carts/:cid
PUT    /api/carts/:cid/product/:pid      → Actualiza cantidad
DELETE /api/carts/:cid/product/:pid
DELETE /api/carts/:cid                   → Vaciar carrito
```

---

## 🔐 Autenticación

### Registro de Usuario

```bash
curl -X POST http://localhost:8080/api/users \
   -H "Content-Type: application/json" \
   -d '{
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@email.com",
      "age": 30,
      "password": "password123"
   }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/sessions/login \
   -H "Content-Type: application/json" \
   -d '{
      "email": "juan@email.com",
      "password": "password123"
   }'
```

### Usar Token JWT

```bash
curl -X GET http://localhost:8080/api/sessions/current \
   -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🧪 Vistas disponibles

- / → Listado de productos
- /products/:pid → Detalle del producto, con botón para agregar al carrito
- /carts/:cid → Ver el carrito completo con productos, cantidades y botón de compra

---

## 🧾 Licencia

Licencia MIT
