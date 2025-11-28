const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get user ranking by points
router.get('/', authenticateToken, async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;

        const [ranking] = await db.query(
            `SELECT id, nombre_completo, puntos, 
              (SELECT COUNT(*) FROM ejercicio_usuario WHERE usuarioId = usuario.id) as ejercicios_completados
       FROM usuario
       WHERE rol = 'Cliente'
       ORDER BY puntos DESC
       LIMIT ?`,
            [limit]
        );

        // Add rank position
        const rankingWithPosition = ranking.map((user, index) => ({
            ...user,
            posicion: index + 1
        }));

        res.json(rankingWithPosition);
    } catch (error) {
        console.error('Error fetching ranking:', error);
        res.status(500).json({ error: 'Error al obtener ranking' });
    }
});

module.exports = router;
