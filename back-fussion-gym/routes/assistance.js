const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Scan user QR for attendance (Admin only - called from mobile app)
router.post('/scan', authenticateToken, requireAdmin, async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { usuarioId, qr_data } = req.body;

        if (!usuarioId) {
            return res.status(400).json({ error: 'Usuario ID es requerido' });
        }

        await connection.beginTransaction();

        // Verify user exists
        const [users] = await connection.query('SELECT * FROM usuario WHERE id = ?', [usuarioId]);
        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = users[0];

        // Get the special "Asistencia Regular" exercise
        const [exercises] = await connection.query(
            'SELECT * FROM ejercicio WHERE nombre = "Asistencia Regular" LIMIT 1'
        );

        if (exercises.length === 0) {
            await connection.rollback();
            return res.status(500).json({ error: 'Ejercicio de asistencia no configurado' });
        }

        const attendanceExercise = exercises[0];

        // Check if already registered attendance today
        const [attendanceToday] = await connection.query(
            `SELECT id FROM ejercicio_usuario 
       WHERE usuarioId = ? AND ejercicioId = ? AND DATE(fecha_completado) = CURDATE()`,
            [usuarioId, attendanceExercise.id]
        );

        if (attendanceToday.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                error: 'Asistencia ya registrada hoy',
                usuario: user.nombre_completo
            });
        }

        // Record attendance
        await connection.query(
            'INSERT INTO ejercicio_usuario (usuarioId, ejercicioId) VALUES (?, ?)',
            [usuarioId, attendanceExercise.id]
        );

        // Add points to user
        await connection.query(
            'UPDATE usuario SET puntos = puntos + ? WHERE id = ?',
            [attendanceExercise.puntos, usuarioId]
        );

        // Get updated user points
        const [updatedUsers] = await connection.query('SELECT puntos FROM usuario WHERE id = ?', [usuarioId]);

        await connection.commit();

        res.json({
            message: 'Asistencia registrada exitosamente',
            usuario: user.nombre_completo,
            puntos_ganados: attendanceExercise.puntos,
            puntos_totales: updatedUsers[0].puntos
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error registering attendance:', error);
        res.status(500).json({ error: 'Error al registrar asistencia' });
    } finally {
        connection.release();
    }
});

// Get attendance history (Admin only)
router.get('/history', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [attendance] = await db.query(
            `SELECT eu.id, eu.fecha_completado, u.nombre_completo, u.email, e.puntos
       FROM ejercicio_usuario eu
       JOIN usuario u ON eu.usuarioId = u.id
       JOIN ejercicio e ON eu.ejercicioId = e.id
       WHERE e.nombre = 'Asistencia Regular'
       ORDER BY eu.fecha_completado DESC
       LIMIT 100`
        );

        res.json(attendance);
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({ error: 'Error al obtener historial de asistencia' });
    }
});

module.exports = router;
