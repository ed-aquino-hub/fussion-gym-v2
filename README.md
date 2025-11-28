# FUSSION GYM Ecosystem

Sistema gamificado completo para gimnasios con puntos, niveles y premios.

## 📁 Estructura del Proyecto

```
fussion-gym/
├── back-fussion-gym/      # Backend API (Node.js + Express + MySQL)
├── front-fussion-gym/     # Frontend Web (React + Vite)
├── app-fussion-gym/       # App Móvil (React Native + Expo)
├── schema.sql             # Esquema de base de datos
└── seed.sql               # Datos de prueba
```

## 🚀 Quick Start

### 1. Base de Datos

```bash
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

### 2. Backend

```bash
cd back-fussion-gym
npm install
npm start
```

Backend disponible en: `http://localhost:5000`

### 3. Frontend Web

```bash
cd front-fussion-gym
npm install
npm run dev
```

Frontend disponible en: `http://localhost:5173`

### 4. App Móvil

```bash
cd app-fussion-gym
npm install
npx expo start
```

Escanear QR con Expo Go app.

## 👥 Credenciales de Prueba

**Administrador:**
- Email: `admin@fussion.gym`
- Password: `password123`

**Cliente:**
- Email: `carlos@email.com`
- Password: `password123`

## 🎨 Características

- 🎮 Gamificación completa con puntos y niveles
- 📱 QR para registrar ejercicios y asistencia
- 🏆 Sistema de premios y canjes
- 📊 Rankings en tiempo real
- 👥 Gestión de usuarios (admin)
- 📈 Dashboard administrativo con KPIs

## 🛠️ Tecnologías

**Backend:**
- Node.js + Express
- MySQL
- JWT para autenticación

**Frontend Web:**
- React 18
- Vite
- React Router
- Axios

**App Móvil:**
- React Native
- Expo Router
- Expo Camera + Barcode Scanner

## 📖 Documentación

Cada subcarpeta contiene su propio README con instrucciones detalladas:
- [Backend README](./back-fussion-gym/README.md)
- [Frontend README](./front-fussion-gym/README.md)
- [Mobile README](./app-fussion-gym/README.md)
- [API Documentation](./back-fussion-gym/API_DOC.md)

## 🎯 Flujo de Uso

1. **Cliente** registra cuenta en web o recibe membresía
2. **Cliente** ingresa al gimnasio y presenta QR en recepción
3. **Admin** escanea QR del cliente → puntos por asistencia
4. **Cliente** escanea QR en máquinas/ejercicios → puntos por actividad
5. **Cliente** acumula puntos y canjea premios
6. **Admin** gestiona usuarios, premios y valida canjes

##  📄 Licencia

MIT License - FUSSION GYM 2024
