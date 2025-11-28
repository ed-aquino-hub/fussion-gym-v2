# FUSSION GYM Backend

Backend API para el sistema gamificado de gimnasio FUSSION GYM.

## Tecnologías

- Node.js
- Express.js
- MySQL (mysql2)
- JWT (jsonwebtoken)
- bcrypt

## Características

- ✅ Autenticación con JWT
- ✅ Control de acceso basado en roles (Cliente/Administrador)
- ✅ Gestión de usuarios y perfiles
- ✅ Sistema de puntos y gamificación
- ✅ Escaneo de QR para ejercicios
- ✅ Sistema de premios y canjes
- ✅ Registro de asistencias
- ✅ Ranking de usuarios
- ✅ Transacciones de base de datos para operaciones críticas

## Estructura del Proyecto

```
back-fussion-gym/
├── config/
│   └── database.js          # Configuración de MySQL
├── middleware/
│   └── auth.js              # Middleware de autenticación JWT
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── users.js             # Rutas de usuarios
│   ├── exercises.js         # Rutas de ejercicios
│   ├── rewards.js           # Rutas de premios
│   ├── assistance.js        # Rutas de asistencia
│   └── ranking.js           # Rutas de ranking
├── .env                     # Variables de entorno
├── server.js                # Punto de entrada
├── package.json
└── API_DOC.md              # Documentación de API
```

## Configuración

1. **Configurar variables de entorno** en `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=fussion_gym
JWT_SECRET=tu_secreto_jwt_seguro
```

2. **Crear la base de datos**:
```bash
mysql -u root -p < ../schema.sql
```

3. **Cargar datos de prueba**:
```bash
mysql -u root -p < ../seed.sql
```

## Ejecución

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

La API estará disponible en `http://localhost:5000`

## Endpoints Principales

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/users` - Listar usuarios (Admin)
- `GET /api/exercises` - Listar ejercicios
- `POST /api/exercises/scan` - Escanear QR de ejercicio
- `GET /api/rewards` - Listar premios
- `POST /api/rewards/redeem` - Canjear premio
- `POST /api/assistance/scan` - Registrar asistencia (Admin)
- `GET /api/ranking` - Ver ranking

Ver [API_DOC.md](./API_DOC.md) para documentación completa.

## Usuarios de Prueba

**Administrador:**
- Email: `admin@fussion.gym`
- Password: `password123`

**Clientes:**
- Email: `carlos@email.com` / Password: `password123`
- Email: `maria@email.com` / Password: `password123`
- Email: `juan@email.com` / Password: `password123`

## Seguridad

- Las contraseñas se hashean con bcrypt
- Las rutas protegidas requieren token JWT
- Control de acceso basado en roles
- Validación de permisos en cada endpoint

## Base de Datos

El sistema utiliza MySQL con las siguientes tablas:
- `usuario` - Usuarios del sistema
- `membresia` - Tipos de membresías
- `usuario_membresia` - Relación usuario-membresía
- `categoria` - Categorías de ejercicios
- `ejercicio` - Ejercicios disponibles
- `ejercicio_usuario` - Historial de ejercicios completados
- `premio` - Premios disponibles para canje
- `premio_reclamado` - Historial de canjes
