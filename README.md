# 🛍️ CoderHouse Backend II - E-commerce API

## 📋 Descripción del Proyecto

Este proyecto es una **API REST completa para un e-commerce** desarrollada en Node.js con Express, que incluye funcionalidades de gestión de productos, carritos de compras, usuarios y sistema de tickets. El proyecto implementa autenticación JWT, autorización por roles, WebSockets para actualizaciones en tiempo real, y un sistema completo de recuperación de contraseñas por email.

### 🎯 Características Principales

- ✅ **Gestión completa de productos** con paginación, filtros y búsqueda
- 🛒 **Sistema de carritos de compra** personalizado por usuario
- 👥 **Autenticación y autorización** con JWT y roles (admin/user)
- 🎫 **Sistema de tickets** para procesar compras
- 📧 **Recuperación de contraseñas** por email con tokens seguros
- 🔄 **WebSockets** para actualizaciones en tiempo real
- 📱 **Interfaz web** con Handlebars para testing y demostración
- 🏗️ **Arquitectura en capas** con DTO, Repository y Service patterns
- 🔐 **Seguridad** con bcrypt para contraseñas y validaciones completas

## 🚀 Tecnologías Utilizadas

### Backend Core

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **Mongoose** - ODM para MongoDB
- **MongoDB** - Base de datos NoSQL

### Autenticación y Seguridad

- **JWT (jsonwebtoken)** - Tokens de autenticación
- **Passport.js** con **passport-jwt** - Middleware de autenticación
- **bcrypt** - Hashing de contraseñas
- **express-session** - Manejo de sesiones
- **connect-mongo** - Store de sesiones en MongoDB

### Tiempo Real y Comunicación

- **Socket.IO** - WebSockets para tiempo real
- **Nodemailer** - Envío de emails

### Frontend (Para testing y demostración)

- **Express Handlebars** - Motor de plantillas
- **CSS** - Estilos personalizados
- **JavaScript** - Interactividad del frontend

### Utilidades y Herramientas

- **mongoose-paginate-v2** - Paginación de resultados
- **uuid** - Generación de IDs únicos
- **dotenv** - Variables de entorno
- **cookie-parser** - Parsing de cookies
- **nodemon** - Auto-restart durante desarrollo

## 📁 Estructura del Proyecto

```
📦 CoderHouse-Proyecto-Backend-II/
├── 📄 package.json
├── 📂 data/
│   └── products.json          # Datos de productos para seeding
├── 📂 src/
│   ├── 🚀 app.js             # Archivo principal de la aplicación
│   ├── 📂 dao/               # Data Access Objects
│   │   ├── CartDAO.js
│   │   ├── ProductDAO.js
│   │   ├── TicketDAO.js
│   │   └── UserDAO.js
│   ├── 📂 dto/               # Data Transfer Objects
│   │   ├── CartDTO.js
│   │   ├── ProductDTO.js
│   │   ├── TicketDTO.js
│   │   └── UserDTO.js
│   ├── 📂 managers/          # Business Logic Managers
│   │   └── CartManager.js
│   ├── 📂 middlewares/       # Middlewares personalizados
│   │   ├── auth.js
│   │   ├── authorization.js
│   │   └── 📂 passport/
│   │       └── passport-jwt.js
│   ├── 📂 models/            # Modelos de Mongoose
│   │   ├── cart.model.js
│   │   ├── password-reset-token.model.js
│   │   ├── product.model.js
│   │   ├── ticket.model.js
│   │   └── user.model.js
│   ├── 📂 public/            # Archivos estáticos
│   │   ├── styles.css
│   │   └── 📂 js/
│   │       └── realtime.js
│   ├── 📂 repositories/      # Repository Pattern
│   │   ├── CartRepository.js
│   │   ├── ProductRepository.js
│   │   ├── TicketRepository.js
│   │   └── UserRepository.js
│   ├── 📂 routes/            # Definición de rutas
│   │   ├── carts.router.js
│   │   ├── products.router.js
│   │   ├── sessions.router.js
│   │   ├── tickets.router.js
│   │   ├── users.router.js
│   │   └── views.router.js
│   ├── 📂 services/          # Servicios de negocio
│   │   ├── EmailService.js
│   │   └── PasswordResetService.js
│   ├── 📂 utils/             # Utilidades
│   │   ├── crypto.js
│   │   └── jwt.js
│   └── 📂 views/             # Plantillas Handlebars
│       ├── cart.handlebars
│       ├── error.handlebars
│       ├── home.handlebars
│       ├── login.handlebars
│       ├── product-detail.handlebars
│       ├── products.handlebars
│       ├── realTimeProducts.handlebars
│       ├── register.handlebars
│       ├── request-password-reset.handlebars
│       ├── reset-password.handlebars
│       ├── tickets.handlebars
│       ├── 📂 layouts/
│       │   └── main.handlebars
│       └── 📂 partials/
│           └── navbar.handlebars
```

## 🔧 Configuración e Instalación

### 1. Prerrequisitos

- **Node.js** v18 o superior
- **MongoDB** (local o Atlas)
- **Git**

### 2. Clonar el repositorio

```bash
git clone https://github.com/LukaLattanzi/CoderHouse-Proyecto-Backend-II.git
cd CoderHouse-Proyecto-Backend-II
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
# 🗄️ BASE DE DATOS
MONGO_URL=mongodb://localhost:27017/coderhouse-backend
# Para MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# 🔐 SEGURIDAD Y AUTENTICACIÓN
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_minimo_32_caracteres
SECRET_KEY=tu_secret_key_para_passport_jwt_muy_seguro
SESSION_SECRET=tu_session_secret_para_express_session

# 📧 CONFIGURACIÓN DE EMAIL (Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail

# 🌐 SERVIDOR
PORT=8080
NODE_ENV=development
```

### 5. Configuración de Gmail (Opcional)

Para el envío de emails de recuperación de contraseña:

1. Habilita la **verificación en 2 pasos** en tu cuenta de Gmail
2. Genera una **contraseña de aplicación**:
   - Ve a tu cuenta de Google → Seguridad
   - En "Verificación en 2 pasos", busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Mail"
   - Usa esa contraseña en `EMAIL_PASS`

> **Nota:** Si no configuras Gmail, el sistema usará **Ethereal Email** automáticamente para testing (los emails se pueden ver en https://ethereal.email).

### 6. Ejecutar la aplicación

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start

# Ejecutar seeding de datos (opcional)
npm run seed
```

La aplicación estará disponible en: **http://localhost:8080**

## 📡 API Endpoints

### 🔐 Autenticación y Sesiones (`/api/sessions`)

| Método | Endpoint                               | Descripción                    | Auth   |
| ------ | -------------------------------------- | ------------------------------ | ------ |
| `POST` | `/api/sessions/register`               | Registro de nuevo usuario      | ❌     |
| `POST` | `/api/sessions/login`                  | Login con JWT                  | ❌     |
| `POST` | `/api/sessions/web-login`              | Login para interfaz web        | ❌     |
| `POST` | `/api/sessions/web-register`           | Registro para interfaz web     | ❌     |
| `GET`  | `/api/sessions/current`                | Información del usuario actual | ✅ JWT |
| `POST` | `/api/sessions/logout`                 | Cerrar sesión                  | ✅     |
| `POST` | `/api/sessions/request-password-reset` | Solicitar reset de contraseña  | ❌     |
| `POST` | `/api/sessions/reset-password`         | Resetear contraseña con token  | ❌     |

### 👥 Usuarios (`/api/users`)

| Método   | Endpoint         | Descripción               | Auth |
| -------- | ---------------- | ------------------------- | ---- |
| `POST`   | `/api/users`     | Crear usuario             | ❌   |
| `GET`    | `/api/users`     | Listar todos los usuarios | ❌   |
| `GET`    | `/api/users/:id` | Obtener usuario por ID    | ❌   |
| `PUT`    | `/api/users/:id` | Actualizar usuario        | ❌   |
| `DELETE` | `/api/users/:id` | Eliminar usuario          | ❌   |

### 📦 Productos (`/api/products`)

| Método   | Endpoint             | Descripción                     | Auth   | Rol        |
| -------- | -------------------- | ------------------------------- | ------ | ---------- |
| `GET`    | `/api/products`      | Listar productos con paginación | ✅ JWT | user/admin |
| `GET`    | `/api/products/:pid` | Obtener producto por ID         | ✅ JWT | user/admin |
| `POST`   | `/api/products`      | Crear producto                  | ✅ JWT | admin      |
| `PUT`    | `/api/products/:pid` | Actualizar producto             | ✅ JWT | admin      |
| `DELETE` | `/api/products/:pid` | Eliminar producto               | ✅ JWT | admin      |

**Parámetros de consulta para GET /api/products:**

- `limit`: Número de productos por página (default: 10)
- `page`: Página actual (default: 1)
- `sort`: Ordenamiento por precio (`asc` o `desc`)
- `query`: Filtrar por categoría

### 🛒 Carritos (`/api/carts`)

| Método   | Endpoint                        | Descripción                     | Auth   | Permisos      |
| -------- | ------------------------------- | ------------------------------- | ------ | ------------- |
| `GET`    | `/api/carts/:cid`               | Obtener carrito                 | ✅ JWT | Dueño o admin |
| `POST`   | `/api/carts/:cid/products/:pid` | Agregar producto al carrito     | ✅ JWT | Dueño o admin |
| `PUT`    | `/api/carts/:cid/products/:pid` | Actualizar cantidad de producto | ✅ JWT | Dueño o admin |
| `DELETE` | `/api/carts/:cid/products/:pid` | Eliminar producto del carrito   | ✅ JWT | Dueño o admin |
| `DELETE` | `/api/carts/:cid`               | Vaciar carrito                  | ✅ JWT | Dueño o admin |
| `POST`   | `/api/carts/:cid/purchase`      | Procesar compra                 | ✅ JWT | Dueño o admin |

### 🎫 Tickets (`/api/tickets`)

| Método | Endpoint                   | Descripción               | Auth   | Permisos      |
| ------ | -------------------------- | ------------------------- | ------ | ------------- |
| `GET`  | `/api/tickets/:id`         | Obtener ticket por ID     | ✅ JWT | Dueño o admin |
| `GET`  | `/api/tickets/code/:code`  | Obtener ticket por código | ✅ JWT | Dueño o admin |
| `GET`  | `/api/tickets/user/:email` | Tickets del usuario       | ✅ JWT | Dueño o admin |
| `GET`  | `/api/tickets`             | Todos los tickets         | ✅ JWT | admin         |
| `PUT`  | `/api/tickets/:id/status`  | Actualizar estado         | ✅ JWT | admin         |

### 🌐 Rutas Web (Views)

| Método | Endpoint                  | Descripción                   |
| ------ | ------------------------- | ----------------------------- |
| `GET`  | `/`                       | Página de inicio              |
| `GET`  | `/products`               | Lista de productos            |
| `GET`  | `/products/:pid`          | Detalle de producto           |
| `GET`  | `/cart`                   | Ver carrito                   |
| `GET`  | `/login`                  | Página de login               |
| `GET`  | `/register`               | Página de registro            |
| `GET`  | `/realTimeProducts`       | Productos en tiempo real      |
| `GET`  | `/request-password-reset` | Solicitar reset de contraseña |
| `GET`  | `/reset-password`         | Resetear contraseña           |
| `GET`  | `/tickets`                | Ver tickets del usuario       |

## 🗄️ Modelos de Datos

### 👤 Usuario (User)

```javascript
{
  _id: ObjectId,
  first_name: String,      // Nombre
  last_name: String,       // Apellido
  email: String,           // Email único
  age: Number,             // Edad
  password: String,        // Contraseña hasheada
  cart: ObjectId,          // Referencia al carrito
  role: String,            // 'user' | 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### 📦 Producto (Product)

```javascript
{
  _id: ObjectId,
  title: String,           // Título del producto
  description: String,     // Descripción
  price: Number,           // Precio
  code: String,            // Código único
  stock: Number,           // Stock disponible
  category: String,        // Categoría
  status: Boolean,         // Estado activo/inactivo
  thumbnails: [String]     // URLs de imágenes
}
```

### 🛒 Carrito (Cart)

```javascript
{
  _id: ObjectId,
  products: [{
    product: ObjectId,     // Referencia al producto
    quantity: Number       // Cantidad
  }]
}
```

### 🎫 Ticket (Ticket)

```javascript
{
  _id: ObjectId,
  code: String,            // Código único (UUID)
  purchase_datetime: Date, // Fecha de compra
  amount: Number,          // Total de la compra
  purchaser: String,       // Email del comprador
  cart: ObjectId,          // Referencia al carrito
  products: [{
    product: ObjectId,     // Referencia al producto
    quantity: Number,      // Cantidad comprada
    price: Number          // Precio al momento de compra
  }]
}
```

## 🔐 Sistema de Autenticación

### JWT (JSON Web Tokens)

- **Header de autorización**: `Bearer <token>`
- **Expiración**: Configurable (default: 24h)
- **Payload**: ID del usuario, email, rol

### Roles y Permisos

- **`user`**: Acceso a productos, su propio carrito y tickets
- **`admin`**: Acceso completo a toda la API

### Middlewares de Seguridad

- `authenticateJWT`: Valida token JWT
- `authorize`: Verifica roles específicos
- `verifyCartOwnership`: Verifica que el usuario sea dueño del carrito

## 📧 Sistema de Emails

### Características

- **Gmail** para producción (con App Password)
- **Ethereal Email** para testing/desarrollo
- **Nodemailer** como motor de envío
- **Templates HTML** responsivos

### Tipos de Email

- Reset de contraseña con token seguro
- Confirmación de compra (futuro)
- Bienvenida de usuario (futuro)

## 🔄 WebSockets (Socket.IO)

### Funcionalidades

- **Productos en tiempo real**: Actualizaciones automáticas de la lista
- **Agregar productos**: Los cambios se reflejan instantáneamente
- **Eliminar productos**: Actualización inmediata para todos los clientes

### Eventos

- `connection`: Cliente conectado
- `productList`: Envía lista de productos
- `addProduct`: Agregar nuevo producto
- `deleteProduct`: Eliminar producto
- `disconnect`: Cliente desconectado

## 🧪 Testing y Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm run seed     # Poblar base de datos con datos de prueba
```

### Colección de Postman

Se puede crear una colección con todos los endpoints para testing de la API.

### Frontend de Testing

La aplicación incluye una interfaz web completa en `/views` para probar todas las funcionalidades:

- Login/Registro
- Lista de productos
- Carrito de compras
- Gestión en tiempo real
- Reset de contraseñas

## 🚀 Despliegue

### Variables de Entorno Requeridas

```env
MONGO_URL=tu_mongodb_connection_string
JWT_SECRET=tu_jwt_secret_muy_seguro
SECRET_KEY=tu_secret_key_para_passport
SESSION_SECRET=tu_session_secret
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
PORT=8080
NODE_ENV=production
```

### Recomendaciones

- Usa **MongoDB Atlas** para la base de datos
- Configura **Gmail** con App Password para emails
- Usa **render.com**, **railway.app** o **heroku** para despliegue
- Configura **CORS** si el frontend está en dominio diferente

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

**Luka Lattanzi**

- GitHub: [@LukaLattanzi](https://github.com/LukaLattanzi)

## 🙏 Agradecimientos

- **CoderHouse** por la formación en Backend
- **Node.js** y **Express.js** community
- **MongoDB** team por la excelente documentación
