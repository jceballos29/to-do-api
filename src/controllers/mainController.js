// ========================================
// CONTROLADOR PRINCIPAL (Main Controller)
// ========================================
// Este archivo contiene controladores para endpoints generales de la API
// No relacionados específicamente con tareas

/**
 * Clase MainController - Maneja endpoints generales de la aplicación
 * Incluye información de la API, salud del sistema, etc.
 */
class MainController {
    /**
     * Constructor del controlador principal
     */
    constructor() {
        console.log('MainController inicializado');
    }

    /**
     * GET / - Página de inicio con información de la API
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    getApiInfo(req, res) {
        console.log('GET / - Información de la API solicitada');
        
        try {
            const apiInfo = {
                message: '¡Bienvenido a la TODO API!',
                version: '2.0.0',
                description: 'API REST para gestión de tareas con arquitectura MVC',
                architecture: 'MVC (Model-View-Controller)',
                features: [
                    'Operaciones CRUD completas',
                    'Filtrado por estado',
                    'Validaciones robustas',
                    'Timestamps automáticos',
                    'Arquitectura escalable',
                    'Manejo de errores consistente'
                ],
                endpoints: {
                    // Información general
                    'GET /': 'Información de la API',
                    'GET /health': 'Estado de salud del servidor',
                    
                    // Endpoints de tareas
                    'GET /api/tasks': 'Obtener todas las tareas (opcional: ?status=0|1|2 para filtrar)',
                    'GET /api/tasks/stats': 'Obtener estadísticas de las tareas',
                    'GET /api/tasks/:id': 'Obtener una tarea específica',
                    'POST /api/tasks': 'Crear una nueva tarea',
                    'PUT /api/tasks/:id': 'Actualizar una tarea completa',
                    'PATCH /api/tasks/:id/status': 'Cambiar solo el estado de una tarea',
                    'DELETE /api/tasks/:id': 'Eliminar una tarea'
                },
                taskStructure: {
                    id: 'number - Identificador único',
                    title: 'string - Título corto de la tarea',
                    description: 'string - Descripción detallada',
                    status: 'number - Estado (0=Pendiente, 1=En progreso, 2=Completada)',
                    createdAt: 'string - Fecha de creación (ISO 8601)',
                    updatedAt: 'string - Fecha de última actualización (ISO 8601)'
                },
                statusCodes: {
                    0: 'Pendiente',
                    1: 'En progreso',
                    2: 'Completada'
                },
                examples: {
                    createTask: {
                        method: 'POST',
                        url: '/api/tasks',
                        body: {
                            title: 'Mi nueva tarea',
                            description: 'Descripción detallada de la tarea',
                            status: 0
                        }
                    },
                    filterTasks: {
                        method: 'GET',
                        url: '/api/tasks?status=1',
                        description: 'Obtener solo tareas en progreso'
                    }
                },
                documentation: {
                    repository: 'https://github.com/usuario/to-do-api',
                    readme: 'Ver README.md para documentación completa'
                },
                timestamp: new Date().toISOString()
            };

            res.json(apiInfo);
            console.log('GET / - Información de la API enviada exitosamente');
        } catch (error) {
            console.error('GET / - Error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error obteniendo información de la API',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * GET /health - Endpoint de salud del servidor
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    getHealthCheck(req, res) {
        console.log('GET /health - Verificación de salud solicitada');
        
        try {
            const healthData = {
                status: 'healthy',
                message: 'Servidor funcionando correctamente',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
                version: '2.0.0',
                memory: {
                    used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                    total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                    unit: 'MB'
                },
                services: {
                    api: 'operational',
                    fileSystem: 'operational',
                    taskService: 'operational'
                }
            };

            res.json(healthData);
            console.log('GET /health - Estado de salud enviado exitosamente');
        } catch (error) {
            console.error('GET /health - Error:', error.message);
            res.status(503).json({
                status: 'unhealthy',
                message: 'Error en verificación de salud',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * GET /version - Información de versión de la API
     * @param {Object} req - Objeto de petición de Express
     * @param {Object} res - Objeto de respuesta de Express
     */
    getVersion(req, res) {
        console.log('GET /version - Información de versión solicitada');
        
        try {
            const versionInfo = {
                version: '2.0.0',
                name: 'TODO API',
                description: 'API REST para gestión de tareas',
                releaseDate: '2025-08-07',
                architecture: 'MVC',
                changelog: {
                    '2.0.0': [
                        'Refactorización completa con arquitectura MVC',
                        'Agregado campo title a las tareas',
                        'Mejores validaciones y manejo de errores',
                        'Endpoint de estadísticas',
                        'Documentación mejorada'
                    ],
                    '1.0.0': [
                        'Versión inicial con funcionalidad básica CRUD',
                        'Soporte para filtrado por estado',
                        'Timestamps automáticos'
                    ]
                },
                dependencies: {
                    express: '^4.21.2',
                    nodemon: '^3.1.10'
                },
                timestamp: new Date().toISOString()
            };

            res.json(versionInfo);
            console.log('GET /version - Información de versión enviada exitosamente');
        } catch (error) {
            console.error('GET /version - Error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error obteniendo información de versión',
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = MainController;
