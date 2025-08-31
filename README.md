# � Backend E-commerce - CoderHouse Proyecto Final

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-brightgreen.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue.svg)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.x-red.svg)](https://mongoosejs.com/)
[![Handlebars](https://img.shields.io/badge/Handlebars-Express-orange.svg)](https://handlebarsjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-blue.svg)](https://socket.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-yellow.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-ISC-lightgrey.svg)]()

---

## 📘 Descripción

Aplicación backend completa de e-commerce desarrollada con Node.js, Express y MongoDB. Incluye sistema de autenticación dual (JWT para APIs + Sessions para web), gestión completa de productos y carritos, sistema de compras con tickets, vistas dinámicas con Handlebars y WebSockets para actualizaciones en tiempo real.

**Características principales:**

- 🔐 **Doble autenticación**: JWT para APIs y Sessions para navegador web
- 🛍️ **E-commerce completo**: Productos, carritos, compras y tickets
- 📱 **Dual Frontend**: API REST + Vistas web con Handlebars
- 🔄 **Tiempo real**: WebSockets para actualizaciones instantáneas
- 🗄️ **Base de datos**: MongoDB con Mongoose y paginación avanzada

---

## 🚀 Stack Tecnológico

### **Backend Core**

- **Node.js** (v18+) - Runtime de JavaScript
- **Express** (v5.1.0) - Framework web minimalista
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Mongoose** (v8.16.4) - ODM con esquemas y validaciones

### **Autenticación y Seguridad**

- **JWT** (jsonwebtoken v9.0.2) - Tokens para autenticación API
- **Express Session** (v1.18.2) - Sesiones persistentes para web
- **Passport JWT** (v4.0.1) - Estrategia de autenticación
- **bcrypt** (v5.1.1) - Hash de contraseñas
- **connect-mongo** (v5.1.0) - Store de sesiones en MongoDB

### **Frontend y Vistas**

- **Handlebars** (v8.0.3) - Motor de plantillas dinámicas
- **Socket.io** (v4.8.1) - WebSockets bidireccionales
- **CSS** personalizado para estilos

### **Utilidades**

- **mongoose-paginate-v2** (v1.9.1) - Paginación avanzada
- **UUID** (v11.1.0) - Generación de IDs únicos para tickets
- **dotenv** (v17.2.0) - Variables de entorno
- **nodemon** (v3.1.10) - Desarrollo con hot reload

---

## 🛠 Características Principales

### 🔐 **Sistema de Autenticación Dual**

#### **API Authentication (JWT)**

- Registro y login con tokens JWT
- Headers: `Authorization: Bearer <token>`
- Para Postman, aplicaciones móviles, etc.
- Tokens con expiración configurable

#### **Web Authentication (Sessions)**

- Sesiones persistentes en MongoDB (TTL: 14 días)
- Cookies automáticas para navegadores
- Login/logout con formularios HTML
- Redirecciones automáticas

### 🛍️ **E-commerce Completo**

#### **Gestión de Productos**

- CRUD completo con validaciones
- Paginación avanzada (`?limit=10&page=1`)
- Filtrado por categoría (`?query=electronics`)
- Ordenamiento por precio (`?sort=asc|desc`)
- Control de stock automático

#### **Sistema de Carritos**

- Carritos únicos por usuario
- Agregar/eliminar productos
- Actualización de cantidades
- Auto-creación de carritos para nuevos usuarios
- Persistencia entre sesiones

#### **Sistema de Compras**

- Verificación de stock automática
- Generación de tickets únicos (UUID)
- Actualización de inventario
- Creación de carrito nuevo post-compra
- Historial completo de transacciones

### 📊 **Modelos de Datos**

#### **Users**

```javascript
{
  first_name: String,
  last_name: String,
  email: String (unique),
  age: Number,
  password: String (hashed),
  role: String (default: "user"),
  cart: ObjectId (ref: Cart)
}
```

#### **Products**

```javascript
{
  title: String,
  description: String,
  code: String (unique),
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [String]
}
```

#### **Carts**

```javascript
{
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number
  }]
}
```

#### **Tickets**

```javascript
{
  code: String (UUID, unique),
  purchase_datetime: Date,
  amount: Number,
  purchaser: String (email),
  cart: ObjectId (ref: Cart),
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }]
}
```

### 🌐 **Frontend Web Completo**

#### **Vistas Disponibles**

- **`/`** → Redirección a productos (autenticado) o login
- **`/login`** → Formulario de inicio de sesión
- **`/register`** → Formulario de registro
- **`/products`** → Listado paginado con filtros y ordenamiento
- **`/products/:pid`** → Detalle del producto con "Agregar al carrito"
- **`/carts/:cid`** → Vista del carrito con tabla de productos
- **`/logout`** → Cerrar sesión y limpiar cookies

#### **Características de las Vistas**

- Navegación intuitiva con navbar
- Paginación visual (Anterior/Siguiente)
- Formularios reactivos con validación
- Mensajes de error personalizados
- Responsive design básico

### ⚡ **WebSockets (Socket.io)**

- Conexión bidireccional en tiempo real
- Actualizaciones instantáneas de productos
- Notificaciones de stock y cambios
- Integración con vistas dinámicas

---

## ⚙️ Instalación y Configuración

### **📥 Clonación del Repositorio**

```bash
git clone https://github.com/LukaLattanzi/CoderHouse-Proyecto-Backend-II.git
cd CoderHouse-Proyecto-Backend-II
```

### **📦 Instalación de Dependencias**

```bash
npm install
```

### **🔧 Variables de Entorno**

Crear archivo `.env` en la raíz del proyecto:

```dotenv
# Puerto del servidor
PORT=8080

# Conexión a MongoDB Atlas
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Secretos para encriptación
SESSION_SECRET=your-super-secret-session-key-here
SECRET_KEY=your-jwt-secret-key-here
```

> **📝 Nota**: Reemplaza `<username>`, `<password>`, `<cluster>` y `<database>` con tus credenciales reales de MongoDB Atlas.

### **🚀 Ejecución del Proyecto**

#### **Desarrollo con Hot Reload**

```bash
npm run dev
```

#### **Producción**

```bash
npm start
```

### **🌐 Acceso a la Aplicación**

Una vez iniciado el servidor:

- **Frontend Web**: [http://localhost:8080](http://localhost:8080)
- **API REST**: [http://localhost:8080/api](http://localhost:8080/api)
- **Documentación**: Este README

### **🗄️ Configuración de MongoDB**

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito
3. Configurar usuario de base de datos
4. Obtener string de conexión
5. Agregar IP a whitelist (0.0.0.0/0 para desarrollo)

---

## 🔧 API REST - Endpoints Completos

### **👥 Autenticación y Usuarios**

#### **Registro de Usuario**

```http
POST /api/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@email.com",
  "age": 30,
  "password": "password123"
}
```

#### **Login API (JWT)**

```http
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@email.com",
  "password": "password123"
}

# Response: { "token": "eyJhbGciOiJIUzI1NiIs..." }
```

#### **Login Web (Sessions)**

```http
POST /api/sessions/web-login
Content-Type: application/x-www-form-urlencoded

email=juan@email.com&password=password123
```

#### **Usuario Actual**

```http
GET /api/sessions/current
Authorization: Bearer <JWT_TOKEN>
```

#### **CRUD de Usuarios**

```http
GET    /api/users              # Obtener todos los usuarios
GET    /api/users/:id          # Obtener usuario por ID
POST   /api/users              # Crear usuario
PUT    /api/users/:id          # Actualizar usuario
DELETE /api/users/:id          # Eliminar usuario
```

### **🛍️ Gestión de Productos**

#### **Listar Productos con Filtros**

```http
GET /api/products?limit=10&page=1&sort=asc&query=electronics

# Parámetros opcionales:
# - limit: productos por página (default: 10)
# - page: número de página (default: 1)
# - sort: asc|desc (ordenar por precio)
# - query: filtrar por categoría
```

#### **CRUD de Productos**

```http
GET    /api/products/:pid      # Obtener producto por ID
POST   /api/products           # Crear producto
PUT    /api/products/:pid      # Actualizar producto
DELETE /api/products/:pid      # Eliminar producto
```

#### **Crear Producto (Ejemplo)**

```http
POST /api/products
Content-Type: application/json

{
  "title": "iPhone 15 Pro",
  "description": "Smartphone Apple último modelo",
  "code": "IPHONE15PRO",
  "price": 999.99,
  "stock": 50,
  "category": "electronics",
  "thumbnails": ["img1.jpg", "img2.jpg"]
}
```

### **🛒 Gestión de Carritos**

#### **Ver Carrito**

```http
GET /api/carts/:cid
Authorization: Bearer <JWT_TOKEN>
```

#### **Agregar Producto al Carrito**

```http
POST /api/carts/:cid/products/:pid
Authorization: Bearer <JWT_TOKEN>

# Incrementa cantidad si el producto ya existe
```

#### **Actualizar Cantidad de Producto**

```http
PUT /api/carts/:cid/products/:pid
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "quantity": 3
}
```

#### **Eliminar Producto del Carrito**

```http
DELETE /api/carts/:cid/products/:pid
Authorization: Bearer <JWT_TOKEN>
```

#### **Actualizar Carrito Completo**

```http
PUT /api/carts/:cid
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "products": [
    {
      "product": "producto_id_1",
      "quantity": 2
    },
    {
      "product": "producto_id_2",
      "quantity": 1
    }
  ]
}
```

#### **Vaciar Carrito**

```http
DELETE /api/carts/:cid
Authorization: Bearer <JWT_TOKEN>
```

### **🧾 Sistema de Compras**

#### **Finalizar Compra**

```http
POST /api/carts/:cid/purchase
Authorization: Bearer <JWT_TOKEN>

# Response incluye:
# - ticket: información completa de la compra
# - newCartId: ID del nuevo carrito vacío
# - productsNotInStock: productos sin stock suficiente
```

### **🔍 Endpoints de Debug**

#### **Verificar JWT Manual**

```http
GET /api/sessions/current-manual
Authorization: Bearer <JWT_TOKEN>
```

#### **Debug de JWT**

```http
GET /api/sessions/debug-jwt
Authorization: Bearer <JWT_TOKEN>
```

#### **Test de Conectividad**

```http
GET /api/sessions/test
```

### **📊 Formatos de Respuesta**

#### **Respuesta Exitosa**

```json
{
  "status": "success",
  "payload": { ... },
  "message": "Operación completada"
}
```

#### **Respuesta de Error**

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

#### **Respuesta de Productos (Paginada)**

```json
{
  "status": "success",
  "payload": {
    "docs": [...],           // Array de productos
    "totalDocs": 25,         // Total de documentos
    "limit": 10,             // Límite por página
    "page": 1,               // Página actual
    "totalPages": 3,         // Total de páginas
    "hasNextPage": true,     // Hay página siguiente
    "hasPrevPage": false,    // Hay página anterior
    "nextPage": 2,           // Número de página siguiente
    "prevPage": null         // Número de página anterior
  }
}
```

---

## 🧪 Ejemplos de Uso

### **🔐 Flujo de Autenticación Completo**

#### **1. Registro de Usuario**

```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "María",
    "last_name": "García",
    "email": "maria@email.com",
    "age": 28,
    "password": "mypassword123"
  }'
```

#### **2. Login y Obtención de Token**

```bash
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@email.com",
    "password": "mypassword123"
  }'

# Response: {"status":"success","token":"eyJhbGciOiJIUzI1NiIs..."}
```

#### **3. Verificar Token**

```bash
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:8080/api/sessions/current \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### **🌐 Navegación Web**

#### **1. Acceso Directo**

```
http://localhost:8080/               → Redirige a /login o /products
http://localhost:8080/register       → Formulario de registro
http://localhost:8080/login          → Formulario de login
```

#### **2. Después de Autenticarse**

```
http://localhost:8080/products       → Catálogo de productos
http://localhost:8080/products/ID    → Detalle de producto
http://localhost:8080/carts/ID       → Vista del carrito
http://localhost:8080/logout         → Cerrar sesión
```

---

## 📁 Estructura del Proyecto

```
📂 CoderHouse-Proyecto-Backend-II/
├── 📄 package.json              # Dependencias y scripts
├── 📄 README.md                 # Documentación completa
├── 📄 .env                      # Variables de entorno (no incluido)
├── 📂 data/
│   └── 📄 products.json         # Datos iniciales de productos
├── 📂 src/
│   ├── 📄 app.js                # Servidor principal y configuración
│   ├── 📂 routes/               # Definición de endpoints
│   │   ├── 📄 products.router.js    # CRUD de productos
│   │   ├── 📄 carts.router.js       # Gestión de carritos
│   │   ├── 📄 sessions.router.js    # Autenticación JWT y web
│   │   ├── 📄 users.router.js       # CRUD de usuarios
│   │   └── 📄 views.router.js       # Rutas de vistas web
│   ├── 📂 models/               # Esquemas de MongoDB
│   │   ├── 📄 user.model.js         # Modelo de usuarios
│   │   ├── 📄 product.model.js      # Modelo de productos
│   │   ├── 📄 cart.model.js         # Modelo de carritos
│   │   └── 📄 ticket.model.js       # Modelo de tickets
│   ├── 📂 middlewares/          # Middleware personalizado
│   │   ├── 📄 auth.js               # Autenticación web
│   │   └── 📂 passport/
│   │       └── 📄 passport-jwt.js   # Estrategia JWT
│   ├── 📂 managers/             # Lógica de negocio
│   │   └── 📄 CartManager.js        # Gestión de carritos
│   ├── 📂 utils/                # Utilidades
│   │   ├── 📄 crypto.js             # Hash de contraseñas
│   │   └── 📄 jwt.js                # Manejo de JWT
│   ├── 📂 views/                # Plantillas Handlebars
│   │   ├── 📄 login.handlebars      # Formulario de login
│   │   ├── 📄 register.handlebars   # Formulario de registro
│   │   ├── 📄 products.handlebars   # Lista de productos
│   │   ├── 📄 product-detail.handlebars # Detalle producto
│   │   ├── 📄 cart.handlebars       # Vista del carrito
│   │   ├── 📄 error.handlebars      # Página de error
│   │   ├── 📂 layouts/
│   │   │   └── 📄 main.handlebars   # Layout principal
│   │   └── 📂 partials/
│   │       └── 📄 navbar.handlebars # Barra de navegación
│   └── 📂 public/               # Archivos estáticos
│       ├── 📄 styles.css            # Estilos CSS
│       └── 📂 js/
│           └── 📄 realtime.js       # Cliente WebSocket
```

### **📦 Dependencias Principales**

#### **Core Framework**

- `express@5.1.0` - Framework web
- `mongoose@8.16.4` - ODM para MongoDB

#### **Autenticación**

- `passport@0.7.0` - Middleware de autenticación
- `passport-jwt@4.0.1` - Estrategia JWT
- `jsonwebtoken@9.0.2` - Manejo de JWT
- `bcrypt@5.1.1` - Hash de contraseñas

#### **Sesiones y Base de Datos**

- `express-session@1.18.2` - Manejo de sesiones
- `connect-mongo@5.1.0` - Store de sesiones en MongoDB
- `mongoose-paginate-v2@1.9.1` - Paginación

#### **Frontend**

- `express-handlebars@8.0.3` - Motor de plantillas
- `socket.io@4.8.1` - WebSockets bidireccionales

#### **Utilidades**

- `uuid@11.1.0` - Generación de IDs únicos
- `dotenv@17.2.0` - Variables de entorno

## 🗄️ Base de Datos - MongoDB Collections

### **📊 Colecciones Principales**

#### **`users`** - Información de usuarios registrados

```javascript
{
  _id: ObjectId,
  first_name: "María",
  last_name: "García",
  email: "maria@email.com",
  age: 28,
  password: "$2b$10$hash...",    // Hash bcrypt
  role: "user",                 // user | admin
  cart: ObjectId,               // Referencia al carrito activo
  __v: 0
}
```

#### **`products`** - Catálogo de productos

```javascript
{
  _id: ObjectId,
  title: "iPhone 15 Pro",
  description: "Smartphone Apple último modelo",
  code: "IPHONE15PRO",          // Único
  price: 999.99,
  status: true,                 // Disponible/No disponible
  stock: 50,
  category: "electronics",
  thumbnails: ["img1.jpg", "img2.jpg"],
  __v: 0
}
```

#### **`carts`** - Carritos de compras

```javascript
{
  _id: ObjectId,
  products: [
    {
      product: ObjectId,        // Ref a products
      quantity: 2,
      _id: ObjectId
    }
  ],
  __v: 0
}
```

#### **`tickets`** - Registro de compras

```javascript
{
  _id: ObjectId,
  code: "uuid-generated-string",     // UUID único
  purchase_datetime: ISODate,
  amount: 1999.98,                   // Total de la compra
  purchaser: "maria@email.com",      // Email del comprador
  cart: ObjectId,                    // Ref al carrito original
  products: [                        // Snapshot de productos comprados
    {
      product: ObjectId,
      quantity: 2,
      price: 999.99,
      _id: ObjectId
    }
  ],
  __v: 0
}
```

#### **`sessions`** - Sesiones web persistentes

```javascript
{
  _id: "session-cookie-id",
  expires: ISODate("2025-09-14T..."),
  session: {
    cookie: {
      originalMaxAge: null,
      expires: null,
      httpOnly: true,
      path: "/"
    },
    userId: ObjectId,              // ID del usuario autenticado
    userEmail: "maria@email.com"   // Email del usuario
  }
}
```

### **🔄 Relaciones entre Colecciones**

1. **User → Cart**: Cada usuario tiene un carrito activo (`user.cart`)
2. **Cart → Products**: Los carritos referencian productos con cantidades
3. **Ticket → Cart**: Los tickets mantienen referencia al carrito original
4. **Ticket → Products**: Snapshot de productos al momento de la compra
5. **Sessions → Users**: Las sesiones identifican usuarios por `userId`

### **⚡ Índices y Performance**

- **users.email**: Índice único para login rápido
- **products.code**: Índice único para códigos de producto
- **tickets.code**: Índice único para códigos de ticket
- **sessions.\_id**: Índice automático para lookup de sesiones

---

## 📝 Licencia

**ISC License** - Consulta el archivo `package.json` para más detalles.

---

## 👨‍💻 Autor

**Luka Lattanzi** - [GitHub](https://github.com/LukaLattanzi)

**Proyecto Final - CoderHouse Backend II**

---

## 🙏 Agradecimientos

- **CoderHouse** por la formación en desarrollo backend
- **MongoDB Atlas** por la base de datos gratuita
- **Comunidad de Node.js** por las librerías utilizadas

---
