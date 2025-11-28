# FUSSION GYM API Documentation

API REST para el sistema gamificado de gimnasio FUSSION GYM.

**Base URL:** `http://localhost:5000/api`

## Autenticación

La API utiliza JSON Web Tokens (JWT) para autenticación. Incluye el token en el header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### POST /auth/register
Registrar nuevo usuario.

**Body:**
```json
{
  "nombre_completo": "Juan Pérez",
  "dni": "12345678",
  "email": "juan@email.com",
  "password": "password123",
  "telefono": "555-1234",
  "edad": 25,
  "condiciones_medicas": "Ninguna"
}
```

**Response:**
```json
{
  "message": "Usuario registrado exitosamente",
  "userId": 5
}
```

#### POST /auth/login
Iniciar sesión.

**Body:**
```json
{
  "email": "juan@email.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "nombre_completo": "Juan Pérez",
    "email": "juan@email.com",
    "rol": "Cliente",
    "puntos": 0
  }
}
```

---

### Users

#### GET /users
Obtener todos los usuarios (Admin only).

**Headers:** Authorization required

**Response:**
```json
[
  {
    "id": 2,
    "nombre_completo": "Carlos Ramírez",
    "email": "carlos@email.com",
    "puntos": 450,
    "rol": "Cliente"
  }
]
```

#### GET /users/:id
Obtener usuario por ID.

**Headers:** Authorization required

**Response:**
```json
{
  "id": 2,
  "nombre_completo": "Carlos Ramírez",
  "email": "carlos@email.com",
  "puntos": 450,
  "membresia_nombre": "Básica",
  "membresia_estado": "activa"
}
```

#### PUT /users/:id
Actualizar perfil de usuario.

**Headers:** Authorization required

**Body:**
```json
{
  "nombre_completo": "Carlos Ramírez Actualizado",
  "telefono": "555-9999",
  "edad": 26,
  "condiciones_medicas": "Ninguna"
}
```

#### GET /users/:id/exercises
Obtener historial de ejercicios del usuario.

**Headers:** Authorization required

**Response:**
```json
[
  {
    "id": 15,
    "fecha_completado": "2024-11-20T08:00:00.000Z",
    "nombre": "Spinning",
    "puntos": 30,
    "categoria": "Clases Grupales"
  }
]
```

---

### Exercises

#### GET /exercises
Obtener todos los ejercicios.

**Headers:** Authorization required

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Cinta de Correr",
    "descripcion": "Ejercicio cardiovascular en cinta",
    "puntos": 10,
    "dificultad": "Principiante",
    "qr_code": "QR-CINTA-001",
    "categoria_nombre": "Cardio"
  }
]
```

#### GET /exercises/qr/:qrCode
Obtener ejercicio por código QR.

**Headers:** Authorization required

**Response:**
```json
{
  "id": 1,
  "nombre": "Cinta de Correr",
  "puntos": 10,
  "qr_code": "QR-CINTA-001"
}
```

#### POST /exercises/scan
Escanear QR y completar ejercicio.

**Headers:** Authorization required

**Body:**
```json
{
  "qr_code": "QR-CINTA-001"
}
```

**Response:**
```json
{
  "message": "Ejercicio completado exitosamente",
  "ejercicio": "Cinta de Correr",
  "puntos_ganados": 10,
  "puntos_totales": 460
}
```

---

### Rewards

#### GET /rewards
Obtener todos los premios.

**Headers:** Authorization required

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "🧴 Shaker FUSSION",
    "descripcion": "Botella mezcladora deportiva con logo FUSSION",
    "puntos_necesarios": 100,
    "stock": 50
  }
]
```

#### GET /rewards/:id
Obtener premio por ID.

#### POST /rewards
Crear nuevo premio (Admin only).

**Headers:** Authorization required (Admin)

**Body:**
```json
{
  "nombre": "🏅 Medalla de Oro",
  "descripcion": "Medalla por logros excepcionales",
  "puntos_necesarios": 1000,
  "stock": 10
}
```

#### PUT /rewards/:id
Actualizar premio (Admin only).

#### DELETE /rewards/:id
Eliminar premio (Admin only).

#### POST /rewards/redeem
Canjear premio.

**Headers:** Authorization required

**Body:**
```json
{
  "premioId": 1
}
```

**Response:**
```json
{
  "message": "Premio canjeado exitosamente",
  "premio": "🧴 Shaker FUSSION",
  "puntos_gastados": 100,
  "puntos_restantes": 350
}
```

#### GET /rewards/redemptions/history
Obtener historial de canjes.

**Headers:** Authorization required

**Response:**
```json
[
  {
    "id": 1,
    "fecha_reclamo": "2024-11-10T10:00:00.000Z",
    "premio_nombre": "🧴 Shaker FUSSION",
    "puntos_necesarios": 100
  }
]
```

---

### Assistance

#### POST /assistance/scan
Registrar asistencia escaneando QR del usuario (Admin only).

**Headers:** Authorization required (Admin)

**Body:**
```json
{
  "usuarioId": 2
}
```

**Response:**
```json
{
  "message": "Asistencia registrada exitosamente",
  "usuario": "Carlos Ramírez",
  "puntos_ganados": 50,
  "puntos_totales": 500
}
```

#### GET /assistance/history
Obtener historial de asistencias (Admin only).

**Headers:** Authorization required (Admin)

---

### Ranking

#### GET /ranking
Obtener ranking de usuarios por puntos.

**Headers:** Authorization required

**Query params:**
- `limit` (optional): número de usuarios a retornar (default: 50)

**Response:**
```json
[
  {
    "id": 4,
    "nombre_completo": "Juan Pérez",
    "puntos": 1200,
    "ejercicios_completados": 25,
    "posicion": 1
  },
  {
    "id": 3,
    "nombre_completo": "María González",
    "puntos": 780,
    "ejercicios_completados": 18,
    "posicion": 2
  }
]
```

---

## Error Responses

Todos los endpoints pueden devolver los siguientes errores:

**401 Unauthorized:**
```json
{
  "error": "Token de acceso requerido"
}
```

**403 Forbidden:**
```json
{
  "error": "Acceso denegado"
}
```

**404 Not Found:**
```json
{
  "error": "Recurso no encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error interno del servidor"
}
```

---

## Notes

- Los usuarios con rol "Cliente" se crean por defecto con 0 puntos
- Los ejercicios solo pueden completarse una vez por día
- Los canjes son transaccionales y validan stock y puntos antes de procesar
- El password debe hashearse con bcrypt antes de almacenarse
