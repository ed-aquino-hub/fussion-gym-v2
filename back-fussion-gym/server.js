const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const exerciseRoutes = require('./routes/exercises');
const rewardRoutes = require('./routes/rewards');
const assistanceRoutes = require('./routes/assistance');
const rankingRoutes = require('./routes/ranking');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/assistance', assistanceRoutes);
app.use('/api/ranking', rankingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'FUSSION GYM API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'FUSSION GYM API',
        version: '1.0.0',
        documentation: '/api/health'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FUSSION GYM API running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
