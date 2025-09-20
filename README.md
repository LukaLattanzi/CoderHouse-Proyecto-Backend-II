# E-commerce Backend - Entrega Final

## Descripción

Backend completo de un e-commerce desarrollado con Node.js, Express y MongoDB, implementando patrones de diseño avanzados, sistema de autenticación/autorización robusto y lógica de negocio profesional.

## Características Implementadas

### 🏗️ Arquitectura Profesional

- **Patrón Repository**: Separación clara entre lógica de negocio y acceso a datos
- **DAOs (Data Access Objects)**: Capa de abstracción para operaciones de base de datos
- **DTOs (Data Transfer Objects)**: Transferencia segura de datos sin exponer información sensible
- **Middleware de autorización**: Control granular de acceso por roles

### 🔐 Sistema de Autenticación y Autorización

- **JWT Authentication**: Tokens seguros con expiración
- **Roles de usuario**: Admin y User con permisos diferenciados
- **Middleware de autorización**: Protección de endpoints por roles
- **Ruta `/current` segura**: Solo información no sensible del usuario

### 📧 Sistema de Recuperación de Contraseñas

- **Envío de emails**: Integración con nodemailer
- **Tokens de reset**: Enlaces con expiración de 1 hora
- **Validación de contraseñas**: Evita reutilizar la contraseña anterior
- **Vistas responsivas**: Formularios para solicitar y restablecer contraseñas

### 🛒 Lógica de Compra Robusta

- **Verificación de stock**: Control en tiempo real de inventario
- **Compras parciales**: Manejo de productos sin stock suficiente
- **Generación de tickets**: Documentos completos de compra
- **Actualización automática**: Stock se reduce tras compra exitosa

### 🎫 Sistema de Tickets

- **Modelo completo**: Código único, fecha, comprador, productos y total
- **Control de acceso**: Usuarios ven solo sus tickets, admins ven todos
- **Reportes de ventas**: Estadísticas y análisis para administradores
- **Historial detallado**: Productos, cantidades y precios al momento de compra

## Estructura del Proyecto

```
src/
├── dao/                    # Data Access Objects
│   ├── UserDAO.js
│   ├── ProductDAO.js
│   ├── CartDAO.js
│   └── TicketDAO.js
├── dto/                    # Data Transfer Objects
│   ├── UserDTO.js
│   ├── ProductDTO.js
│   ├── CartDTO.js
│   └── TicketDTO.js
├── repositories/           # Patrón Repository
│   ├── UserRepository.js
│   ├── ProductRepository.js
│   ├── CartRepository.js
│   └── TicketRepository.js
├── services/              # Lógica de negocio
│   ├── EmailService.js
│   └── PasswordResetService.js
├── middlewares/           # Middleware personalizado
│   ├── auth.js
│   └── authorization.js
├── routes/               # Rutas de la API
│   ├── products.router.js
│   ├── carts.router.js
│   ├── sessions.router.js
│   ├── tickets.router.js
│   └── views.router.js
├── models/               # Modelos de MongoDB
├── views/                # Vistas Handlebars
└── utils/                # Utilidades
```

## Instalación y Configuración

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd CoderHouse-Proyecto-Backend-II
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` con los valores correspondientes:

```env
MONGO_URL=mongodb://localhost:27017/ecommerce-backend
SESSION_SECRET=your-session-secret-key
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BASE_URL=http://localhost:8080
PORT=8080
```

4. **Ejecutar la aplicación**

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints de la API

### Autenticación

- `POST /api/sessions/register` - Registrar usuario
- `POST /api/sessions/login` - Iniciar sesión
- `GET /api/sessions/current` - Usuario actual (con DTO seguro)
- `POST /api/sessions/request-password-reset` - Solicitar reset de contraseña
- `POST /api/sessions/reset-password` - Restablecer contraseña

### Productos (Requiere autenticación JWT)

- `GET /api/products` - Listar productos (todos los usuarios)
- `GET /api/products/:id` - Obtener producto (todos los usuarios)
- `POST /api/products` - Crear producto (solo admin)
- `PUT /api/products/:id` - Actualizar producto (solo admin)
- `DELETE /api/products/:id` - Eliminar producto (solo admin)

### Carritos (Requiere autenticación JWT)

- `GET /api/carts/:id` - Obtener carrito (propietario o admin)
- `POST /api/carts/:id/products/:pid` - Agregar producto (solo usuarios)
- `PUT /api/carts/:id/products/:pid` - Actualizar cantidad (solo usuarios)
- `DELETE /api/carts/:id/products/:pid` - Eliminar producto (solo usuarios)
- `POST /api/carts/:id/purchase` - Procesar compra (solo usuarios)

### Tickets (Requiere autenticación JWT)

- `GET /api/tickets/user/my-tickets` - Mis tickets (usuario actual)
- `GET /api/tickets/:id` - Obtener ticket (propietario o admin)
- `GET /api/tickets` - Listar todos los tickets (solo admin)
- `GET /api/tickets/reports/sales` - Reporte de ventas (solo admin)

## Roles y Autorización

### Usuario (`user`)

- ✅ Ver productos
- ✅ Agregar productos al carrito
- ✅ Realizar compras
- ✅ Ver sus propios tickets
- ❌ Crear/editar/eliminar productos
- ❌ Ver tickets de otros usuarios

### Administrador (`admin`)

- ✅ Todas las acciones de usuario
- ✅ Crear/editar/eliminar productos
- ✅ Ver todos los carritos y tickets
- ✅ Generar reportes de ventas
- ❌ Agregar productos a carritos (lógica de negocio)

## Patrones de Diseño Implementados

### Repository Pattern

Separa la lógica de negocio del acceso a datos:

```javascript
class ProductRepository {
  async createProduct(productData) {
    // Validaciones de negocio
    if (productData.price <= 0) {
      throw new Error("Price must be greater than 0");
    }
    return await this.productDAO.create(productData);
  }
}
```

### DTO Pattern

Transfiere solo datos necesarios y seguros:

```javascript
class UserCurrentDTO {
  constructor(user) {
    this.id = user._id;
    this.email = user.email;
    this.role = user.role;
    // NO incluye password u otros datos sensibles
  }
}
```

## Lógica de Compra

1. **Validación de carrito**: Verifica existencia y propiedad
2. **Verificación de stock**: Comprueba disponibilidad por producto
3. **Procesamiento parcial**: Productos disponibles se compran, otros quedan en carrito
4. **Actualización de inventario**: Stock se reduce automáticamente
5. **Generación de ticket**: Documento completo con detalles de compra
6. **Limpieza de carrito**: Solo productos comprados se eliminan

## Variables de Entorno

Ver `.env.example` para todas las variables necesarias. Las principales son:

- `MONGO_URL`: Conexión a MongoDB
- `JWT_SECRET`: Clave para tokens JWT
- `EMAIL_USER` / `EMAIL_PASS`: Credenciales para envío de emails
- `BASE_URL`: URL base para enlaces en emails

## Características de Seguridad

- 🔐 Contraseñas hasheadas con bcrypt
- 🎫 Tokens JWT con expiración
- 🛡️ Middleware de autorización granular
- 📧 Tokens de reset con expiración (1 hora)
- 🚫 Validación contra reutilización de contraseñas
- 🔒 DTOs para prevenir exposición de datos sensibles

## Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.
