// ========================================
// RUTAS DE TAREAS (Task Routes)
// ========================================
// Este archivo define todas las rutas relacionadas con las tareas
// Las rutas conectan los endpoints HTTP con los métodos del controlador

const express = require('express');
const TaskController = require('../controllers/taskController');

// Crear router de Express para agrupar rutas relacionadas
const router = express.Router();

// Crear instancia del controlador de tareas
const taskController = new TaskController();

// ==========================================
// DEFINICIÓN DE RUTAS
// ==========================================

/**
 * GET /api/tasks/stats - Obtener estadísticas de tareas
 * NOTA: Esta ruta debe ir ANTES de /api/tasks/:id para evitar conflictos
 * (express podría interpretar "stats" como un ID)
 */
router.get('/stats', (req, res) => {
    console.log('Ruta: GET /api/tasks/stats');
    taskController.getTasksStats(req, res);
});

/**
 * GET /api/tasks - Obtener todas las tareas o filtradas por estado
 * Query parameters opcionales:
 * - status: número (0, 1, 2) para filtrar por estado
 * Ejemplos:
 * - GET /api/tasks (todas las tareas)
 * - GET /api/tasks?status=0 (solo pendientes)
 */
router.get('/', (req, res) => {
    console.log('Ruta: GET /api/tasks', req.query);
    taskController.getAllTasks(req, res);
});

/**
 * GET /api/tasks/:id - Obtener una tarea específica por ID
 * Path parameters:
 * - id: número - ID de la tarea
 * Ejemplo: GET /api/tasks/1
 */
router.get('/:id', (req, res) => {
    console.log(`Ruta: GET /api/tasks/${req.params.id}`);
    taskController.getTaskById(req, res);
});

/**
 * POST /api/tasks - Crear una nueva tarea
 * Body (JSON):
 * - title: string (obligatorio) - Título de la tarea
 * - description: string (obligatorio) - Descripción de la tarea
 * - status: number (opcional, por defecto 0) - Estado inicial
 */
router.post('/', (req, res) => {
    console.log('Ruta: POST /api/tasks', req.body);
    taskController.createTask(req, res);
});

/**
 * PUT /api/tasks/:id - Actualizar una tarea completa
 * Path parameters:
 * - id: número - ID de la tarea a actualizar
 * Body (JSON) - campos opcionales:
 * - title: string - Nuevo título
 * - description: string - Nueva descripción
 * - status: number - Nuevo estado
 */
router.put('/:id', (req, res) => {
    console.log(`Ruta: PUT /api/tasks/${req.params.id}`, req.body);
    taskController.updateTask(req, res);
});

/**
 * PATCH /api/tasks/:id/status - Actualizar solo el estado de una tarea
 * Path parameters:
 * - id: número - ID de la tarea
 * Body (JSON):
 * - status: number (obligatorio) - Nuevo estado (0, 1, 2)
 */
router.patch('/:id/status', (req, res) => {
    console.log(`Ruta: PATCH /api/tasks/${req.params.id}/status`, req.body);
    taskController.updateTaskStatus(req, res);
});

/**
 * DELETE /api/tasks/:id - Eliminar una tarea
 * Path parameters:
 * - id: número - ID de la tarea a eliminar
 */
router.delete('/:id', (req, res) => {
    console.log(`Ruta: DELETE /api/tasks/${req.params.id}`);
    taskController.deleteTask(req, res);
});

// ==========================================
// MIDDLEWARE DE MANEJO DE ERRORES ESPECÍFICO PARA TAREAS
// ==========================================

/**
 * Middleware para manejar errores específicos de las rutas de tareas
 * Se ejecuta cuando ocurre un error en cualquier ruta de este router
 */
router.use((error, req, res, next) => {
    console.error('Error en rutas de tareas:', error);
    
    // Si ya se envió una respuesta, no enviar otra
    if (res.headersSent) {
        return next(error);
    }
    
    // Respuesta de error estándar para rutas de tareas
    res.status(500).json({
        success: false,
        message: 'Error interno en el manejo de tareas',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor',
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// MIDDLEWARE PARA RUTAS NO ENCONTRADAS EN TASKS
// ==========================================

/**
 * Middleware para manejar rutas no encontradas específicamente en /api/tasks/*
 * Este middleware se ejecuta solo si ninguna de las rutas anteriores coincide
 */
router.use('*', (req, res) => {
    console.log(`Ruta de tarea no encontrada: ${req.method} ${req.originalUrl}`);
    
    res.status(404).json({
        success: false,
        message: 'Endpoint de tarea no encontrado',
        availableEndpoints: {
            'GET /api/tasks': 'Obtener todas las tareas (opcional: ?status=0|1|2)',
            'GET /api/tasks/stats': 'Obtener estadísticas de las tareas',
            'GET /api/tasks/:id': 'Obtener una tarea específica',
            'POST /api/tasks': 'Crear una nueva tarea',
            'PUT /api/tasks/:id': 'Actualizar una tarea completa',
            'PATCH /api/tasks/:id/status': 'Cambiar solo el estado de una tarea',
            'DELETE /api/tasks/:id': 'Eliminar una tarea'
        },
        requestedPath: req.originalUrl,
        requestedMethod: req.method,
        timestamp: new Date().toISOString()
    });
});

// Exportar el router para usar en la aplicación principal
module.exports = router;
