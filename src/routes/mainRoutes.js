// ========================================
// RUTAS PRINCIPALES (Main Routes)
// ========================================
// Este archivo define las rutas principales de la aplicación
// Incluye endpoints generales como información de la API, salud, etc.

const express = require('express');
const MainController = require('../controllers/mainController');

// Crear router de Express
const router = express.Router();

// Crear instancia del controlador principal
const mainController = new MainController();

// ==========================================
// RUTAS PRINCIPALES
// ==========================================

/**
 * GET / - Información general de la API
 * Devuelve información sobre la API, endpoints disponibles, ejemplos, etc.
 */
router.get('/', (req, res) => {
    console.log('Ruta: GET /');
    mainController.getApiInfo(req, res);
});

/**
 * GET /health - Endpoint de salud del servidor
 * Útil para monitoreo y verificar que el servidor está funcionando
 */
router.get('/health', (req, res) => {
    console.log('Ruta: GET /health');
    mainController.getHealthCheck(req, res);
});

/**
 * GET /version - Información de versión
 * Devuelve información sobre la versión actual de la API
 */
router.get('/version', (req, res) => {
    console.log('Ruta: GET /version');
    mainController.getVersion(req, res);
});

// ==========================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ==========================================

/**
 * Middleware para manejar errores en las rutas principales
 */
router.use((error, req, res, next) => {
    console.error('Error en rutas principales:', error);
    
    if (res.headersSent) {
        return next(error);
    }
    
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
