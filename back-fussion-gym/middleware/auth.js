const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }
        req.user = user; // { id, email, rol }
        next();
    });
};

// Middleware to check if user is Admin
const requireAdmin = (req, res, next) => {
    if (req.user.rol !== 'Administrador') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador' });
    }
    next();
};

// Middleware to check if user is Client
const requireClient = (req, res, next) => {
    if (req.user.rol !== 'Cliente') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Cliente' });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireClient
};
