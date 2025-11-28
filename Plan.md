Plan de Implementación de FUSSION GYM
    Descripción del Objetivo
    Crear un ecosistema completo de gimnasio gamificado, "FUSSION GYM", compuesto por un backend (Node/Express/MySQL), un frontend web (React/Vite) y una aplicación móvil (React Native/Expo). El sistema se centra en la gamificación mediante puntos, códigos QR y recompensas.

Se requiere la opinión del usuario.
IMPORTANTE

    El esquema de base de datos proporcionado se utilizará como fuente de confianza. Asegúrese de que el servidor MySQL esté funcionando y sea accesible. Se asumirá que se deben configurar las credenciales locales estándar (root/contraseña) o las variables de entorno.

Cambios Propuestos
Backend (back-fussion-gym)
    Configuración: Inicializar Node.js, instalar express, mysql2, dotenv, cors, jsonwebtoken y bcryptjs.
    Base de Datos: Crear un script de conexión utilizando el esquema SQL proporcionado.
    Autenticación: Implementar la autenticación JWT para clientes y administradores. Puntos finales de la API:
        POST /auth/register: Registrar nuevos usuarios.
        POST /auth/login: Iniciar sesión.
        GET /users/profile: Obtener información y puntos del usuario.
        GET /prizes: Listar premios.
        POST /prizes/redeem: Canjear un premio.
        POST /exercises/scan: Registrar ejercicios/asistencia mediante QR.
        GET /ranking: Obtener la clasificación del usuario.
        POST /admin/prizes: Crear premios (Administrador).

Interfaz (front-fussion-gym)
    Configuración: Vite + React. Configuración de CSS Tailwind.
    Estilo: Tema oscuro (fondo #0A1A2F), fuentes Poppins/Inter.
    Páginas:
    LandingPage: Hero, explicación de la gamificación, presentación de la aplicación.
        Inicio de sesión/Registro: Formularios de autorización.
        Panel de control (Cliente): Puntos, Membresía, Historial, Premios.
        Panel de control (Administrador): Gestión de usuarios, Gestión de premios.
        Componentes: Barra de navegación, Pie de página, PrizeCard (con emojis), QRDisplay.

App móvil (app-fussion-gym)
    Configuración: React Native + Expo Router.
    Características:
        Inicio de sesión: Pantalla de autorización.
        Perfil: Mostrar código QR, puntos, membresía.
        Escáner: Vista de cámara para escanear códigos QR de la máquina.
        Premios: Listar y canjear premios.
        Navegación: Navegación por pestañas (Inicio, Escanear, Perfil). Plan de verificación
        Pruebas automatizadas
        Ninguna solicitada explícitamente, pero se verificarán los procesos de inicio y compilación del servidor.
        Verificación manual
        Backend: Verificar las respuestas de la API mediante curl o un script de prueba.
        Frontend: Verificar la representación de la página de destino y la lógica del panel.
        Móvil: Verificar el diseño de la pantalla y el flujo de navegación (simular la cámara si es necesario).
