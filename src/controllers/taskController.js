// ========================================
// CONTROLADOR DE TAREAS (Task Controller)
// ========================================
// Este archivo contiene los controladores que manejan las peticiones HTTP
// Los controladores actúan como intermediarios entre las rutas y los servicios

const TaskService = require('../services/taskService');

/**
 * Clase TaskController - Maneja las peticiones HTTP relacionadas con tareas
 * Cada método corresponde a un endpoint de la API
 * Los controladores son responsables de:
 * - Extraer datos de la petición (req)
 * - Llamar al servicio correspondiente
 * - Formatear y enviar la respuesta (res)
 * - Manejar errores de forma consistente
 */
class TaskController {
    /**
     * Constructor del controlador
     * Inicializa el servicio de tareas
     */
    constructor() {
        this.taskService = new TaskService();
        console.log('TaskController inicializado');
    }

    /**
     * GET /api/tasks - Obtiene todas las tareas o filtradas por estado
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async getAllTasks(req, res) {
        try {
            console.log('GET /api/tasks - Iniciando...');
            
            // Extraer parámetro de filtro de estado de la query string
            const { status } = req.query;
            
            let tasks;
            let message;

            if (status !== undefined) {
                // Si hay filtro por estado, usar el método de filtrado
                tasks = this.taskService.getTasksByStatus(status);
                const statusNames = { 0: 'pendientes', 1: 'en progreso', 2: 'completadas' };
                message = `Tareas ${statusNames[parseInt(status)]} obtenidas exitosamente`;
            } else {
                // Si no hay filtro, obtener todas las tareas
                tasks = this.taskService.getAllTasks();
                message = 'Tareas obtenidas exitosamente';
            }

            // Enviar respuesta exitosa
            res.json({
                success: true,
                message,
                data: tasks.map(task => task.toObject()),
                total: tasks.length,
                timestamp: new Date().toISOString()
            });

            console.log(`GET /api/tasks - Éxito: ${tasks.length} tareas devueltas`);
        } catch (error) {
            console.error('GET /api/tasks - Error:', error.message);
            
            // Determinar el código de estado basado en el tipo de error
            const statusCode = error.message.includes('Estado inválido') ? 400 : 500;
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * GET /api/tasks/:id - Obtiene una tarea específica por ID
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async getTaskById(req, res) {
        try {
            const { id } = req.params;
            console.log(`GET /api/tasks/${id} - Iniciando...`);

            // Validar que el ID sea un número
            const taskId = parseInt(id);
            if (isNaN(taskId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de tarea inválido. Debe ser un número.',
                    timestamp: new Date().toISOString()
                });
            }

            // Buscar la tarea
            const task = this.taskService.getTaskById(taskId);

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarea no encontrada',
                    timestamp: new Date().toISOString()
                });
            }

            // Enviar respuesta exitosa
            res.json({
                success: true,
                message: 'Tarea encontrada',
                data: task.toObject(),
                timestamp: new Date().toISOString()
            });

            console.log(`GET /api/tasks/${id} - Éxito: tarea "${task.title}" encontrada`);
        } catch (error) {
            console.error(`GET /api/tasks/${req.params.id} - Error:`, error.message);
            
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * POST /api/tasks - Crea una nueva tarea
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async createTask(req, res) {
        try {
            const taskData = req.body;
            console.log('POST /api/tasks - Iniciando creación de tarea...');

            // Validaciones básicas de entrada
            if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'El título de la tarea es obligatorio y debe ser un texto válido',
                    timestamp: new Date().toISOString()
                });
            }

            if (!taskData.description || typeof taskData.description !== 'string' || taskData.description.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'La descripción de la tarea es obligatoria y debe ser un texto válido',
                    timestamp: new Date().toISOString()
                });
            }

            // Crear la nueva tarea usando el servicio
            const newTask = this.taskService.createTask(taskData);

            // Enviar respuesta exitosa con código 201 (Created)
            res.status(201).json({
                success: true,
                message: 'Tarea creada exitosamente',
                data: newTask.toObject(),
                timestamp: new Date().toISOString()
            });

            console.log(`POST /api/tasks - Éxito: nueva tarea creada con ID ${newTask.id}`);
        } catch (error) {
            console.error('POST /api/tasks - Error:', error.message);
            
            // Determinar el código de estado basado en el tipo de error
            const statusCode = error.message.includes('inválidos') ? 400 : 500;
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * PUT /api/tasks/:id - Actualiza una tarea completa
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            console.log(`PUT /api/tasks/${id} - Iniciando actualización...`);

            // Validar que el ID sea un número
            const taskId = parseInt(id);
            if (isNaN(taskId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de tarea inválido. Debe ser un número.',
                    timestamp: new Date().toISOString()
                });
            }

            // Validaciones específicas para campos que se están actualizando
            if (updateData.title !== undefined) {
                if (typeof updateData.title !== 'string' || updateData.title.trim() === '') {
                    return res.status(400).json({
                        success: false,
                        message: 'El título no puede estar vacío',
                        timestamp: new Date().toISOString()
                    });
                }
            }

            if (updateData.description !== undefined) {
                if (typeof updateData.description !== 'string' || updateData.description.trim() === '') {
                    return res.status(400).json({
                        success: false,
                        message: 'La descripción no puede estar vacía',
                        timestamp: new Date().toISOString()
                    });
                }
            }

            if (updateData.status !== undefined) {
                const status = parseInt(updateData.status);
                if (![0, 1, 2].includes(status)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Estado inválido. Use 0 (pendiente), 1 (en progreso), o 2 (completada)',
                        timestamp: new Date().toISOString()
                    });
                }
            }

            // Actualizar la tarea usando el servicio
            const updatedTask = this.taskService.updateTask(taskId, updateData);

            // Enviar respuesta exitosa
            res.json({
                success: true,
                message: 'Tarea actualizada exitosamente',
                data: updatedTask.toObject(),
                timestamp: new Date().toISOString()
            });

            console.log(`PUT /api/tasks/${id} - Éxito: tarea actualizada`);
        } catch (error) {
            console.error(`PUT /api/tasks/${req.params.id} - Error:`, error.message);
            
            // Determinar el código de estado basado en el tipo de error
            let statusCode = 500;
            if (error.message === 'Tarea no encontrada') {
                statusCode = 404;
            } else if (error.message.includes('inválidos')) {
                statusCode = 400;
            }
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * PATCH /api/tasks/:id/status - Actualiza solo el estado de una tarea
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async updateTaskStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            console.log(`PATCH /api/tasks/${id}/status - Iniciando...`);

            // Validar que el ID sea un número
            const taskId = parseInt(id);
            if (isNaN(taskId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de tarea inválido. Debe ser un número.',
                    timestamp: new Date().toISOString()
                });
            }

            // Validar que se proporcione el estado
            if (status === undefined || status === null) {
                return res.status(400).json({
                    success: false,
                    message: 'El estado es obligatorio',
                    timestamp: new Date().toISOString()
                });
            }

            // Actualizar el estado usando el servicio
            const updatedTask = this.taskService.updateTaskStatus(taskId, status);

            // Obtener nombre del estado para el mensaje
            const statusNames = { 0: 'pendiente', 1: 'en progreso', 2: 'completada' };
            const statusName = statusNames[parseInt(status)];

            // Enviar respuesta exitosa
            res.json({
                success: true,
                message: `Estado cambiado a "${statusName}" exitosamente`,
                data: updatedTask.toObject(),
                timestamp: new Date().toISOString()
            });

            console.log(`PATCH /api/tasks/${id}/status - Éxito: estado cambiado a ${statusName}`);
        } catch (error) {
            console.error(`PATCH /api/tasks/${req.params.id}/status - Error:`, error.message);
            
            // Determinar el código de estado basado en el tipo de error
            let statusCode = 500;
            if (error.message === 'Tarea no encontrada') {
                statusCode = 404;
            } else if (error.message.includes('Estado inválido')) {
                statusCode = 400;
            }
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * DELETE /api/tasks/:id - Elimina una tarea
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            console.log(`DELETE /api/tasks/${id} - Iniciando eliminación...`);

            // Validar que el ID sea un número
            const taskId = parseInt(id);
            if (isNaN(taskId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de tarea inválido. Debe ser un número.',
                    timestamp: new Date().toISOString()
                });
            }

            // Eliminar la tarea usando el servicio
            const deletedTask = this.taskService.deleteTask(taskId);

            // Enviar respuesta exitosa
            res.json({
                success: true,
                message: 'Tarea eliminada exitosamente',
                data: deletedTask.toObject(),
                timestamp: new Date().toISOString()
            });

            console.log(`DELETE /api/tasks/${id} - Éxito: tarea "${deletedTask.title}" eliminada`);
        } catch (error) {
            console.error(`DELETE /api/tasks/${req.params.id} - Error:`, error.message);
            
            // Determinar el código de estado basado en el tipo de error
            const statusCode = error.message === 'Tarea no encontrada' ? 404 : 500;
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * GET /api/tasks/stats - Obtiene estadísticas de las tareas
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    async getTasksStats(req, res) {
        try {
            console.log('GET /api/tasks/stats - Iniciando...');

            // Obtener estadísticas usando el servicio
            const stats = this.taskService.getTasksStats();

            // Enviar respuesta exitosa
            res.json({
                success: true,
                message: 'Estadísticas obtenidas exitosamente',
                data: stats,
                timestamp: new Date().toISOString()
            });

            console.log('GET /api/tasks/stats - Éxito: estadísticas generadas');
        } catch (error) {
            console.error('GET /api/tasks/stats - Error:', error.message);
            
            res.status(500).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = TaskController;
