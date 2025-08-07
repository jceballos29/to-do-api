// ========================================
// SERVIDOR PRINCIPAL - ARQUITECTURA MVC
// ========================================
// Este es el archivo principal de la aplicación TODO API refactorizada
// Implementa arquitectura MVC (Model-View-Controller) para mejor organización

// 1. IMPORTACIONES
const express = require('express');
const path = require('path');

// Importar rutas
const mainRoutes = require('./src/routes/mainRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

// 2. CONFIGURACIÓN DE LA APLICACIÓN
const app = express();
const PORT = process.env.PORT || 3000;

console.log('=========================================');
console.log('🚀 Iniciando TODO API v2.0 (Arquitectura MVC)');
console.log('=========================================');

// 3. MIDDLEWARE GLOBAL
/**
 * Middleware para parsear JSON en las peticiones
 * Permite que el servidor entienda el contenido JSON
 */
app.use(express.json({
    limit: '10mb', // Límite de tamaño del JSON
    strict: true   // Solo acepta arrays y objetos como JSON válido
}));

/**
 * Middleware para parsear URL-encoded data
 * Útil para formularios HTML tradicionales
 */
app.use(express.urlencoded({ 
    extended: true,
    limit: '10mb'
}));

/**
 * Middleware de logging personalizado
 * Registra todas las peticiones HTTP para debugging
 */
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
    
    // Agregar timestamp a la respuesta
    res.locals.requestTimestamp = timestamp;
    
    next();
});

/**
 * Middleware para establecer headers de respuesta comunes
 */
app.use((req, res, next) => {
    // Headers de CORS básicos (Cross-Origin Resource Sharing)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Header de tipo de contenido por defecto
    res.header('Content-Type', 'application/json; charset=utf-8');
    
    // Header personalizado para identificar la API
    res.header('X-API-Version', '2.0.0');
    res.header('X-API-Architecture', 'MVC');
    
    next();
});

/**
 * Middleware para manejar preflight requests (OPTIONS)
 */
app.options('*', (req, res) => {
    res.status(200).end();
});

// 4. CONFIGURACIÓN DE RUTAS
console.log('📋 Configurando rutas...');

/**
 * Rutas principales (/, /health, /version)
 * Manejadas por mainRoutes
 */
app.use('/', mainRoutes);

/**
 * Rutas de tareas (/api/tasks/*)
 * Manejadas por taskRoutes
 */
app.use('/api/tasks', taskRoutes);

// 5. MIDDLEWARE DE MANEJO DE RUTAS NO ENCONTRADAS
/**
 * Este middleware se ejecuta cuando ninguna ruta anterior coincide
 * Proporciona una respuesta útil indicando las rutas disponibles
 */
app.use('*', (req, res) => {
    console.log(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        requestedEndpoint: {
            method: req.method,
            path: req.originalUrl
        },
        availableEndpoints: {
            // Endpoints principales
            'GET /': 'Información general de la API',
            'GET /health': 'Estado de salud del servidor',
            'GET /version': 'Información de versión',
            
            // Endpoints de tareas
            'GET /api/tasks': 'Listar todas las tareas (query: ?status=0|1|2)',
            'GET /api/tasks/stats': 'Estadísticas de las tareas',
            'GET /api/tasks/:id': 'Obtener tarea específica',
            'POST /api/tasks': 'Crear nueva tarea',
            'PUT /api/tasks/:id': 'Actualizar tarea completa',
            'PATCH /api/tasks/:id/status': 'Cambiar estado de tarea',
            'DELETE /api/tasks/:id': 'Eliminar tarea'
        },
        suggestions: [
            'Verifica que la URL esté correcta',
            'Revisa que el método HTTP sea el correcto',
            'Consulta GET / para ver todos los endpoints disponibles'
        ],
        timestamp: new Date().toISOString()
    });
});

// 6. MIDDLEWARE DE MANEJO DE ERRORES GLOBAL
/**
 * Middleware de manejo de errores de nivel aplicación
 * Se ejecuta cuando cualquier ruta o middleware lanza un error
 */
app.use((error, req, res, next) => {
    console.error('💥 Error no manejado:', error);
    
    // Si ya se envió una respuesta, delegar al manejador por defecto de Express
    if (res.headersSent) {
        return next(error);
    }
    
    // Determinar el código de estado del error
    const statusCode = error.statusCode || error.status || 500;
    
    // Crear respuesta de error estándar
    const errorResponse = {
        success: false,
        message: 'Error interno del servidor',
        timestamp: new Date().toISOString()
    };
    
    // En desarrollo, incluir más detalles del error
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error = {
            message: error.message,
            stack: error.stack,
            name: error.name
        };
    }
    
    res.status(statusCode).json(errorResponse);
});

// 7. FUNCIÓN PARA INICIAR EL SERVIDOR
/**
 * Inicia el servidor HTTP y configura manejadores de eventos
 */
function startServer() {
    const server = app.listen(PORT, () => {
        console.log('=========================================');
        console.log('✅ TODO API v2.0 iniciada exitosamente');
        console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`🏗️  Arquitectura: MVC (Model-View-Controller)`);
        console.log(`📁 Estructura de archivos organizada en src/`);
        console.log('');
        console.log('📋 Endpoints principales:');
        console.log(`   GET    http://localhost:${PORT}/`);
        console.log(`   GET    http://localhost:${PORT}/health`);
        console.log(`   GET    http://localhost:${PORT}/version`);
        console.log('');
        console.log('📋 Endpoints de tareas:');
        console.log(`   GET    http://localhost:${PORT}/api/tasks`);
        console.log(`   GET    http://localhost:${PORT}/api/tasks/stats`);
        console.log(`   GET    http://localhost:${PORT}/api/tasks/:id`);
        console.log(`   POST   http://localhost:${PORT}/api/tasks`);
        console.log(`   PUT    http://localhost:${PORT}/api/tasks/:id`);
        console.log(`   PATCH  http://localhost:${PORT}/api/tasks/:id/status`);
        console.log(`   DELETE http://localhost:${PORT}/api/tasks/:id`);
        console.log('=========================================');
    });

    // Manejo graceful de cierre del servidor
    process.on('SIGTERM', () => {
        console.log('🔄 Recibida señal SIGTERM, cerrando servidor...');
        server.close(() => {
            console.log('✅ Servidor cerrado correctamente');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('🔄 Recibida señal SIGINT (Ctrl+C), cerrando servidor...');
        server.close(() => {
            console.log('✅ Servidor cerrado correctamente');
            process.exit(0);
        });
    });
}

// 8. MANEJO DE ERRORES GLOBALES NO CAPTURADOS
/**
 * Maneja excepciones no capturadas para evitar que el proceso se cierre
 */
process.on('uncaughtException', (error) => {
    console.error('💥 Excepción no capturada:', error);
    console.error('Stack trace:', error.stack);
    
    // En producción, podrías querer cerrar el proceso de forma graceful
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

/**
 * Maneja promesas rechazadas no capturadas
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Promesa rechazada no manejada en:', promise);
    console.error('Razón:', reason);
    
    // En producción, podrías querer cerrar el proceso de forma graceful
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

// 9. INICIAR LA APLICACIÓN
console.log('🔧 Configuración completada, iniciando servidor...');
startServer();

// Exportar la aplicación para testing
module.exports = app;
