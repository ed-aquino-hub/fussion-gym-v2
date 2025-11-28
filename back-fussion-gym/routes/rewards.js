const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all rewards
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rewards] = await db.query(
            'SELECT * FROM premio ORDER BY puntos_necesarios ASC'
        );
        res.json(rewards);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Error al obtener premios' });
    }
});

// Get single reward
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [rewards] = await db.query('SELECT * FROM premio WHERE id = ?', [id]);

        if (rewards.length === 0) {
            return res.status(404).json({ error: 'Premio no encontrado' });
        }

        res.json(rewards[0]);
    } catch (error) {
        console.error('Error fetching reward:', error);
        res.status(500).json({ error: 'Error al obtener premio' });
    }
});

// Create reward (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { nombre, descripcion, puntos_necesarios, stock } = req.body;

        if (!nombre || !puntos_necesarios || stock === undefined) {
            return res.status(400).json({ error: 'Nombre, puntos necesarios y stock son requeridos' });
        }

        const [result] = await db.query(
            'INSERT INTO premio (nombre, descripcion, puntos_necesarios, stock) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, puntos_necesarios, stock]
        );

        res.status(201).json({
            message: 'Premio creado exitosamente',
            premioId: result.insertId
        });
    } catch (error) {
        console.error('Error creating reward:', error);
        res.status(500).json({ error: 'Error al crear premio' });
    }
});

// Update reward (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, puntos_necesarios, stock } = req.body;

        await db.query(
            'UPDATE premio SET nombre = ?, descripcion = ?, puntos_necesarios = ?, stock = ? WHERE id = ?',
            [nombre, descripcion, puntos_necesarios, stock, id]
        );

        res.json({ message: 'Premio actualizado exitosamente' });
    } catch (error) {
        console.error('Error updating reward:', error);
        res.status(500).json({ error: 'Error al actualizar premio' });
    }
});

// Delete reward (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM premio WHERE id = ?', [id]);
        res.json({ message: 'Premio eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting reward:', error);
        res.status(500).json({ error: 'Error al eliminar premio' });
    }
});

// Redeem reward
router.post('/redeem', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { premioId } = req.body;
        const usuarioId = req.user.id;

        await connection.beginTransaction();

        // Get reward details
        const [rewards] = await connection.query('SELECT * FROM premio WHERE id = ?', [premioId]);
        if (rewards.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Premio no encontrado' });
        }

        const reward = rewards[0];

        // Check stock
        if (reward.stock <= 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Premio sin stock disponible' });
        }

        // Get user points
        const [users] = await connection.query('SELECT puntos FROM usuario WHERE id = ?', [usuarioId]);
        const user = users[0];

        // Check if user has enough points
        if (user.puntos < reward.puntos_necesarios) {
            await connection.rollback();
            return res.status(400).json({
                error: 'Puntos insuficientes',
                puntos_requeridos: reward.puntos_necesarios,
                puntos_actuales: user.puntos
            });
        }

        // Deduct points from user
        await connection.query(
            'UPDATE usuario SET puntos = puntos - ? WHERE id = ?',
            [reward.puntos_necesarios, usuarioId]
        );

        // Decrease stock
        await connection.query(
            'UPDATE premio SET stock = stock - 1 WHERE id = ?',
            [premioId]
        );

        // Record redemption
        await connection.query(
            'INSERT INTO premio_reclamado (usuarioId, premioId) VALUES (?, ?)',
            [usuarioId, premioId]
        );

        await connection.commit();

        res.json({
            message: 'Premio canjeado exitosamente',
            premio: reward.nombre,
            puntos_gastados: reward.puntos_necesarios,
            puntos_restantes: user.puntos - reward.puntos_necesarios
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error redeeming reward:', error);
        res.status(500).json({ error: 'Error al canjear premio' });
    } finally {
        connection.release();
    }
});

// Get redemption history
router.get('/redemptions/history', authenticateToken, async (req, res) => {
    try {
        let query;
        let params;

        if (req.user.rol === 'Administrador') {
            // Admin sees all redemptions
            query = `
        SELECT pr.*, p.nombre as premio_nombre, p.descripcion as premio_descripcion, 
               p.puntos_necesarios, u.nombre_completo, u.email
        FROM premio_reclamado pr
        JOIN premio p ON pr.premioId = p.id
        JOIN usuario u ON pr.usuarioId = u.id
        ORDER BY pr.fecha_reclamo DESC
      `;
            params = [];
        } else {
            // Client sees only their redemptions
            query = `
        SELECT pr.*, p.nombre as premio_nombre, p.descripcion as premio_descripcion, p.puntos_necesarios
        FROM premio_reclamado pr
        JOIN premio p ON pr.premioId = p.id
        WHERE pr.usuarioId = ?
        ORDER BY pr.fecha_reclamo DESC
      `;
            params = [req.user.id];
        }

        const [redemptions] = await db.query(query, params);
        res.json(redemptions);
    } catch (error) {
        console.error('Error fetching redemption history:', error);
        res.status(500).json({ error: 'Error al obtener historial de canjes' });
    }
});

module.exports = router;
