# FUSSION GYM Frontend

Frontend web para el sistema gamificado de gimnasio FUSSION GYM.

## Tecnologías

- React 18
- Vite
- React Router DOM
- Axios
- QRCode.react

## Características

- ✅ Landing page moderna y animada
- ✅ Autenticación con JWT
- ✅ Dashboard de cliente con perfil, ejercicios, premios y ranking
- ✅ Dashboard de administrador con gestión completa
- ✅ Diseño responsivo con glassmorphism
- ✅ Sistema de puntos en tiempo real
- ✅ Generación de códigos QR

## Ejecución

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Estructura

```
src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas principales
├── context/         # Context API (Auth)
├── services/        # API services
└── assets/          # Recursos estáticos
```

## Usuarios de Prueba

**Admin:**
- Email: admin@fussion.gym
- Password: password123

**Cliente:**
- Email: carlos@email.com
- Password: password123

## Rutas

- `/` - Landing page
- `/login` - Iniciar sesión
- `/register` - Registro
- `/dashboard` - Dashboard del cliente
- `/admin` - Panel administrativo
