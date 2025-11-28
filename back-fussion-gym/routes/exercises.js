const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all exercises
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [exercises] = await db.query(
            `SELECT e.*, c.nombre as categoria_nombre
       FROM ejercicio e
       JOIN categoria c ON e.categoriaId = c.id
       WHERE e.nombre != 'Asistencia Regular'
       ORDER BY c.nombre, e.nombre`
        );
        res.json(exercises);
    } catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ error: 'Error al obtener ejercicios' });
    }
});

// Get exercise by QR code
router.get('/qr/:qrCode', authenticateToken, async (req, res) => {
    try {
        const { qrCode } = req.params;

        const [exercises] = await db.query(
            `SELECT e.*, c.nombre as categoria_nombre
       FROM ejercicio e
       JOIN categoria c ON e.categoriaId = c.id
       WHERE e.qr_code = ?`,
            [qrCode]
        );

        if (exercises.length === 0) {
            return res.status(404).json({ error: 'Ejercicio no encontrado' });
        }

        res.json(exercises[0]);
    } catch (error) {
        console.error('Error fetching exercise by QR:', error);
        res.status(500).json({ error: 'Error al obtener ejercicio' });
    }
});

// Scan QR and complete exercise
router.post('/scan', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { ejercicioId, qr_code } = req.body;
        const usuarioId = req.user.id;

        await connection.beginTransaction();

        // Get exercise details
        let exercise;
        if (ejercicioId) {
            const [exercises] = await connection.query('SELECT * FROM ejercicio WHERE id = ?', [ejercicioId]);
            exercise = exercises[0];
        } else if (qr_code) {
            const [exercises] = await connection.query('SELECT * FROM ejercicio WHERE qr_code = ?', [qr_code]);
            exercise = exercises[0];
        }

        if (!exercise) {
            await connection.rollback();
            return res.status(404).json({ error: 'Ejercicio no encontrado' });
        }

        // Check if already completed today
        const [completedToday] = await connection.query(
            `SELECT id FROM ejercicio_usuario 
       WHERE usuarioId = ? AND ejercicioId = ? AND DATE(fecha_completado) = CURDATE()`,
            [usuarioId, exercise.id]
        );

        if (completedToday.length > 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Ya completaste este ejercicio hoy' });
        }

        // Record exercise completion
        await connection.query(
            'INSERT INTO ejercicio_usuario (usuarioId, ejercicioId) VALUES (?, ?)',
            [usuarioId, exercise.id]
        );

        // Add points to user
        await connection.query(
            'UPDATE usuario SET puntos = puntos + ? WHERE id = ?',
            [exercise.puntos, usuarioId]
        );

        // Get updated user points
        const [users] = await connection.query('SELECT puntos FROM usuario WHERE id = ?', [usuarioId]);

        await connection.commit();

        res.json({
            message: 'Ejercicio completado exitosamente',
            ejercicio: exercise.nombre,
            puntos_ganados: exercise.puntos,
            puntos_totales: users[0].puntos
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error scanning exercise:', error);
        res.status(500).json({ error: 'Error al registrar ejercicio' });
    } finally {
        connection.release();
    }
});

module.exports = router;
