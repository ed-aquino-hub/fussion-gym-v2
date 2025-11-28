const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, nombre_completo, dni, email, telefono, edad, condiciones_medicas, rol, puntos, createdAt, updatedAt 
       FROM usuario 
       ORDER BY puntos DESC`
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Get single user by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Users can only access their own profile unless they're admin
        if (req.user.rol !== 'Administrador' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const [users] = await db.query(
            `SELECT u.id, u.nombre_completo, u.dni, u.email, u.telefono, u.edad, u.condiciones_medicas, 
              u.rol, u.puntos, u.createdAt, u.updatedAt,
              m.nombre as membresia_nombre, m.descripcion as membresia_descripcion,
              um.fecha_inicio as membresia_inicio, um.fecha_fin as membresia_fin, um.estado as membresia_estado
       FROM usuario u
       LEFT JOIN usuario_membresia um ON u.id = um.usuarioId AND um.estado = 'activa'
       LEFT JOIN membresia m ON um.membresiaId = m.id
       WHERE u.id = ?`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// Update user
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_completo, telefono, edad, condiciones_medicas } = req.body;

        // Users can only update their own profile unless they're admin
        if (req.user.rol !== 'Administrador' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        await db.query(
            `UPDATE usuario 
       SET nombre_completo = ?, telefono = ?, edad = ?, condiciones_medicas = ?
       WHERE id = ?`,
            [nombre_completo, telefono, edad, condiciones_medicas, id]
        );

        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Get user exercise history
router.get('/:id/exercises', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Users can only access their own history unless they're admin
        if (req.user.rol !== 'Administrador' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const [exercises] = await db.query(
            `SELECT eu.id, eu.fecha_completado, e.nombre, e.descripcion, e.puntos, c.nombre as categoria
       FROM ejercicio_usuario eu
       JOIN ejercicio e ON eu.ejercicioId = e.id
       JOIN categoria c ON e.categoriaId = c.id
       WHERE eu.usuarioId = ?
       ORDER BY eu.fecha_completado DESC
       LIMIT 50`,
            [id]
        );

        res.json(exercises);
    } catch (error) {
        console.error('Error fetching exercise history:', error);
        res.status(500).json({ error: 'Error al obtener historial de ejercicios' });
    }
});

module.exports = router;
