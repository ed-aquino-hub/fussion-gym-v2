const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { nombre_completo, dni, email, password, telefono, edad, condiciones_medicas } = req.body;

        // Validate required fields
        if (!email || !password || !nombre_completo) {
            return res.status(400).json({ error: 'Email, contraseña y nombre completo son requeridos' });
        }

        // Check if user already exists
        const [existingUser] = await db.query('SELECT id FROM usuario WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await db.query(
            `INSERT INTO usuario (nombre_completo, dni, email, password, telefono, edad, condiciones_medicas, rol, puntos) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Cliente', 0)`,
            [nombre_completo, dni, email, hashedPassword, telefono, edad, condiciones_medicas]
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Find user
        const [users] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                nombre_completo: user.nombre_completo,
                email: user.email,
                rol: user.rol,
                puntos: user.puntos
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
