// ========================================
// TODO API - Una API simple para gestionar tareas
// ========================================

// 1. IMPORTACIONES Y CONFIGURACIÓN INICIAL
// Importamos Express, que es un framework que nos permite crear servidores web de forma sencilla
const express = require('express');
// Importamos el módulo 'fs' (file system) para leer y escribir archivos
const fs = require('fs');
// Importamos 'path' para manejar rutas de archivos de forma segura
const path = require('path');

// Creamos una instancia de Express (nuestro servidor)
const app = express();
// Definimos el puerto donde funcionará nuestro servidor
const PORT = 3000;
// Definimos la ruta del archivo donde están nuestras tareas
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// 2. MIDDLEWARE
// Middleware es código que se ejecuta entre la petición del cliente y la respuesta del servidor
// Este middleware permite que nuestro servidor entienda JSON en las peticiones
app.use(express.json());

// 3. FUNCIONES AUXILIARES
// Estas funciones nos ayudan a leer y escribir el archivo de tareas

/**
 * Función para leer las tareas desde el archivo JSON
 * @returns {Array} Array con todas las tareas
 */
function readTasks() {
    try {
        // Leemos el contenido del archivo tasks.json
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        // Convertimos el texto JSON a un objeto JavaScript
        return JSON.parse(data);
    } catch (error) {
        // Si hay un error (por ejemplo, el archivo no existe), retornamos un array vacío
        console.error('Error leyendo las tareas:', error.message);
        return [];
    }
}

/**
 * Función para guardar las tareas en el archivo JSON
 * @param {Array} tasks - Array de tareas para guardar
 */
function saveTasks(tasks) {
    try {
        // Convertimos el array de tareas a texto JSON con formato bonito (indent de 2 espacios)
        const data = JSON.stringify(tasks, null, 2);
        // Escribimos el texto JSON al archivo
        fs.writeFileSync(TASKS_FILE, data, 'utf8');
    } catch (error) {
        console.error('Error guardando las tareas:', error.message);
    }
}

/**
 * Función para generar un nuevo ID único para las tareas
 * @param {Array} tasks - Array de tareas existentes
 * @returns {number} Nuevo ID único
 */
function generateNewId(tasks) {
    // Si no hay tareas, empezamos con ID 1
    if (tasks.length === 0) return 1;
    // Si hay tareas, tomamos el ID más alto y le sumamos 1
    const maxId = Math.max(...tasks.map(task => task.id));
    return maxId + 1;
}

// 4. DEFINICIÓN DE RUTAS (ENDPOINTS)
// Cada ruta corresponde a una funcionalidad de nuestra API

// ==========================================
// ENDPOINT: GET /api/tasks
// Propósito: Obtener todas las tareas o filtrarlas por estado
// ==========================================
app.get('/api/tasks', (req, res) => {
    // req (request) contiene la información de la petición
    // res (response) es lo que usamos para enviar la respuesta
    
    try {
        // Leemos las tareas del archivo
        const tasks = readTasks();
        
        // Obtenemos el parámetro 'status' de la URL (query parameter)
        // Ejemplo: /api/tasks?status=1
        const statusFilter = req.query.status;
        
        // Si no se especifica filtro, devolvemos todas las tareas
        if (statusFilter === undefined) {
            return res.json({
                success: true,
                message: 'Tareas obtenidas exitosamente',
                data: tasks,
                total: tasks.length
            });
        }
        
        // Si se especifica un filtro, filtramos las tareas por estado
        const status = parseInt(statusFilter);
        
        // Validamos que el estado sea válido (0, 1, o 2)
        if (![0, 1, 2].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Estado inválido. Use 0 (pendiente), 1 (en progreso), o 2 (completada)'
            });
        }
        
        // Filtramos las tareas que tengan el estado solicitado
        const filteredTasks = tasks.filter(task => task.status === status);
        
        // Definimos los nombres de los estados para mostrar un mensaje más claro
        const statusNames = { 0: 'pendientes', 1: 'en progreso', 2: 'completadas' };
        
        res.json({
            success: true,
            message: `Tareas ${statusNames[status]} obtenidas exitosamente`,
            data: filteredTasks,
            total: filteredTasks.length
        });
        
    } catch (error) {
        // Si ocurre algún error, enviamos una respuesta de error
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// ==========================================
// ENDPOINT: GET /api/tasks/:id
// Propósito: Obtener una tarea específica por su ID
// ==========================================
app.get('/api/tasks/:id', (req, res) => {
    try {
        // Obtenemos el ID de la URL (parámetro de ruta)
        // req.params.id es un string, así que lo convertimos a número
        const taskId = parseInt(req.params.id);
        
        // Validamos que el ID sea un número válido
        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tarea inválido'
            });
        }
        
        // Leemos las tareas y buscamos la que tenga el ID solicitado
        const tasks = readTasks();
        const task = tasks.find(t => t.id === taskId);
        
        // Si no encontramos la tarea, enviamos error 404
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }
        
        // Si encontramos la tarea, la enviamos
        res.json({
            success: true,
            message: 'Tarea encontrada',
            data: task
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// ==========================================
// ENDPOINT: POST /api/tasks
// Propósito: Crear una nueva tarea
// ==========================================
app.post('/api/tasks', (req, res) => {
    try {
        // Obtenemos los datos enviados en el cuerpo de la petición
        const { title, status } = req.body;
        
        // Validamos que se haya enviado un título
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título de la tarea es obligatorio'
            });
        }
        
        // Si no se especifica estado, por defecto será 0 (pendiente)
        let taskStatus = status !== undefined ? parseInt(status) : 0;
        
        // Validamos que el estado sea válido
        if (![0, 1, 2].includes(taskStatus)) {
            taskStatus = 0; // Si el estado es inválido, lo ponemos como pendiente
        }
        
        // Leemos las tareas existentes
        const tasks = readTasks();
        
        // Creamos la nueva tarea
        const newTask = {
            id: generateNewId(tasks),
            title: title.trim(),
            status: taskStatus
        };
        
        // Agregamos la nueva tarea al array
        tasks.push(newTask);
        
        // Guardamos todas las tareas (incluyendo la nueva) en el archivo
        saveTasks(tasks);
        
        // Enviamos la respuesta con la tarea creada
        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: newTask
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// ==========================================
// ENDPOINT: PUT /api/tasks/:id
// Propósito: Actualizar una tarea existente
// ==========================================
app.put('/api/tasks/:id', (req, res) => {
    try {
        // Obtenemos el ID de la tarea a actualizar
        const taskId = parseInt(req.params.id);
        
        // Validamos que el ID sea un número válido
        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tarea inválido'
            });
        }
        
        // Obtenemos los nuevos datos del cuerpo de la petición
        const { title, status } = req.body;
        
        // Leemos las tareas existentes
        const tasks = readTasks();
        
        // Buscamos el índice de la tarea que queremos actualizar
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        // Si no encontramos la tarea, enviamos error 404
        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }
        
        // Actualizamos los campos que se enviaron
        if (title !== undefined) {
            // Validamos que el título no esté vacío
            if (title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'El título no puede estar vacío'
                });
            }
            tasks[taskIndex].title = title.trim();
        }
        
        if (status !== undefined) {
            const newStatus = parseInt(status);
            // Validamos que el estado sea válido
            if (![0, 1, 2].includes(newStatus)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado inválido. Use 0 (pendiente), 1 (en progreso), o 2 (completada)'
                });
            }
            tasks[taskIndex].status = newStatus;
        }
        
        // Guardamos los cambios en el archivo
        saveTasks(tasks);
        
        // Enviamos la tarea actualizada
        res.json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: tasks[taskIndex]
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// ==========================================
// ENDPOINT: DELETE /api/tasks/:id
// Propósito: Eliminar una tarea
// ==========================================
app.delete('/api/tasks/:id', (req, res) => {
    try {
        // Obtenemos el ID de la tarea a eliminar
        const taskId = parseInt(req.params.id);
        
        // Validamos que el ID sea un número válido
        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tarea inválido'
            });
        }
        
        // Leemos las tareas existentes
        const tasks = readTasks();
        
        // Buscamos el índice de la tarea que queremos eliminar
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        // Si no encontramos la tarea, enviamos error 404
        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }
        
        // Guardamos la tarea que vamos a eliminar para mostrarla en la respuesta
        const deletedTask = tasks[taskIndex];
        
        // Eliminamos la tarea del array
        tasks.splice(taskIndex, 1);
        
        // Guardamos los cambios en el archivo
        saveTasks(tasks);
        
        // Enviamos confirmación de eliminación
        res.json({
            success: true,
            message: 'Tarea eliminada exitosamente',
            data: deletedTask
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// ==========================================
// ENDPOINT: PATCH /api/tasks/:id/status
// Propósito: Cambiar solo el estado de una tarea
// ==========================================
app.patch('/api/tasks/:id/status', (req, res) => {
    try {
        // Obtenemos el ID de la tarea
        const taskId = parseInt(req.params.id);
        
        // Validamos que el ID sea un número válido
        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tarea inválido'
            });
        }
        
        // Obtenemos el nuevo estado del cuerpo de la petición
        const { status } = req.body;
        
        // Validamos que se haya enviado un estado
        if (status === undefined) {
            return res.status(400).json({
                success: false,
                message: 'El estado es obligatorio'
            });
        }
        
        const newStatus = parseInt(status);
        
        // Validamos que el estado sea válido
        if (![0, 1, 2].includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Estado inválido. Use 0 (pendiente), 1 (en progreso), o 2 (completada)'
            });
        }
        
        // Leemos las tareas existentes
        const tasks = readTasks();
        
        // Buscamos la tarea que queremos actualizar
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        // Si no encontramos la tarea, enviamos error 404
        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }
        
        // Actualizamos solo el estado
        tasks[taskIndex].status = newStatus;
        
        // Guardamos los cambios
        saveTasks(tasks);
        
        // Definimos los nombres de los estados para el mensaje
        const statusNames = { 0: 'pendiente', 1: 'en progreso', 2: 'completada' };
        
        // Enviamos la respuesta
        res.json({
            success: true,
            message: `Estado cambiado a "${statusNames[newStatus]}" exitosamente`,
            data: tasks[taskIndex]
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// ==========================================
// ENDPOINT: GET /
// Propósito: Página de inicio con información de la API
// ==========================================
app.get('/', (req, res) => {
    res.json({
        message: '¡Bienvenido a la TODO API!',
        version: '1.0.0',
        endpoints: {
            'GET /api/tasks': 'Obtener todas las tareas (opcional: ?status=0|1|2 para filtrar)',
            'GET /api/tasks/:id': 'Obtener una tarea específica',
            'POST /api/tasks': 'Crear una nueva tarea',
            'PUT /api/tasks/:id': 'Actualizar una tarea completa',
            'PATCH /api/tasks/:id/status': 'Cambiar solo el estado de una tarea',
            'DELETE /api/tasks/:id': 'Eliminar una tarea'
        },
        status_codes: {
            0: 'Pendiente',
            1: 'En progreso',
            2: 'Completada'
        }
    });
});

// 5. MANEJO DE RUTAS NO ENCONTRADAS
// Este middleware se ejecuta cuando ninguna ruta anterior coincide
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        available_endpoints: [
            'GET /',
            'GET /api/tasks',
            'GET /api/tasks/:id',
            'POST /api/tasks',
            'PUT /api/tasks/:id',
            'PATCH /api/tasks/:id/status',
            'DELETE /api/tasks/:id'
        ]
    });
});

// 6. INICIAR EL SERVIDOR
// Ponemos nuestro servidor a "escuchar" en el puerto especificado
app.listen(PORT, () => {
    console.log('=========================================');
    console.log('🚀 TODO API iniciada exitosamente');
    console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
    console.log('📋 Endpoints disponibles:');
    console.log(`   GET    http://localhost:${PORT}/`);
    console.log(`   GET    http://localhost:${PORT}/api/tasks`);
    console.log(`   GET    http://localhost:${PORT}/api/tasks/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/tasks`);
    console.log(`   PUT    http://localhost:${PORT}/api/tasks/:id`);
    console.log(`   PATCH  http://localhost:${PORT}/api/tasks/:id/status`);
    console.log(`   DELETE http://localhost:${PORT}/api/tasks/:id`);
    console.log('=========================================');
});

// 7. MANEJO DE ERRORES GLOBALES
// Capturamos errores no manejados para evitar que el servidor se cierre
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa rechazada no manejada:', reason);
});