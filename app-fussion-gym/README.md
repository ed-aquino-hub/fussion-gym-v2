# FUSSION GYM Mobile App

Aplicación móvil para cliente y administrador del sistema FUSSION GYM.

## Tecnologías

- React Native
- Expo Router
- Expo Camera / Barcode Scanner
- Axios

## Características

- ✅ Autenticación con JWT
- ✅ Perfil de usuario con QR personal
- ✅ Escáner QR para registrar ejercicios (cliente)
- ✅ Escáner QR para asistencia (admin)
- ✅ Catálogo de premios
- ✅ Historial de canjes
- ✅ Dashboard administrativo

## Ejecución

1. Instalar Expo CLI globalmente (si no lo tienes):
```bash
npm install -g expo-cli
```

2. Iniciar el proyecto:
```bash
npx expo start
```

3. Escanear el código QR con:
   - **iOS**: App Expo Go
   - **Android**: App Expo Go

## Configuración

Edita `services/api.js` y cambia el `API_URL` a la dirección IP de tu máquina donde corre el backend:
```javascript
const API_URL = 'http://TU_IP:5000/api';
```

## Permisos

La app requiere permiso de cámara para:
- Escanear códigos QR de ejercicios (cliente)
- Registrar asistencia escaneando QR del usuario (admin)

## Credenciales de Prueba

**Admin:**
- Email: admin@fussion.gym
- Password: password123

**Cliente:**
- Email: carlos@email.com
- Password: password123

## Estructura

```
app/
├── (auth)/          # Autenticación
├── (client)/        # Pantallas del cliente
├── (admin)/         # Pantallas del admin
└── services/        # API services
```
