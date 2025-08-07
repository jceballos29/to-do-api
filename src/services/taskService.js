// ========================================
// SERVICIO DE TAREAS (Task Service)
// ========================================
// Este archivo contiene la lógica de negocio para las tareas
// Los servicios manejan las operaciones complejas y la interacción con los datos

const path = require('path');
const Task = require('../models/Task');
const FileUtils = require('../utils/fileUtils');
const DateUtils = require('../utils/dateUtils');

/**
 * Clase TaskService - Maneja toda la lógica de negocio de las tareas
 * Esta clase es responsable de:
 * - Operaciones CRUD en las tareas
 * - Validaciones de negocio
 * - Interacción con el archivo de datos
 * - Generación de IDs únicos
 */
class TaskService {
    /**
     * Constructor del servicio
     * Inicializa la ruta del archivo de datos
     */
    constructor() {
        // Ruta del archivo donde se almacenan las tareas
        this.tasksFile = path.join(process.cwd(), 'tasks.json');
        console.log(`TaskService inicializado. Archivo de datos: ${this.tasksFile}`);
    }

    /**
     * Obtiene todas las tareas del archivo
     * @returns {Task[]} Array de instancias de Task
     */
    getAllTasks() {
        try {
            // Leer datos del archivo
            const tasksData = FileUtils.readJSONFile(this.tasksFile, []);
            
            // Convertir cada objeto a instancia de Task
            const tasks = tasksData.map(taskData => Task.fromObject(taskData));
            
            console.log(`Se cargaron ${tasks.length} tareas desde el archivo`);
            return tasks;
        } catch (error) {
            console.error('Error obteniendo todas las tareas:', error.message);
            throw new Error('No se pudieron cargar las tareas');
        }
    }

    /**
     * Obtiene una tarea específica por su ID
     * @param {number} id - ID de la tarea
     * @returns {Task|null} Instancia de Task o null si no se encuentra
     */
    getTaskById(id) {
        try {
            const tasks = this.getAllTasks();
            const task = tasks.find(t => t.id === parseInt(id));
            
            if (task) {
                console.log(`Tarea encontrada con ID ${id}: "${task.title}"`);
            } else {
                console.log(`No se encontró tarea con ID ${id}`);
            }
            
            return task || null;
        } catch (error) {
            console.error(`Error obteniendo tarea con ID ${id}:`, error.message);
            throw new Error('Error al buscar la tarea');
        }
    }

    /**
     * Filtra tareas por estado
     * @param {number} status - Estado a filtrar (0, 1, 2)
     * @returns {Task[]} Array de tareas filtradas
     */
    getTasksByStatus(status) {
        try {
            const statusNum = parseInt(status);
            
            // Validar que el estado sea válido
            if (![0, 1, 2].includes(statusNum)) {
                throw new Error('Estado inválido. Use 0 (pendiente), 1 (en progreso), o 2 (completada)');
            }

            const tasks = this.getAllTasks();
            const filteredTasks = tasks.filter(task => task.status === statusNum);
            
            const statusNames = { 0: 'pendientes', 1: 'en progreso', 2: 'completadas' };
            console.log(`Se encontraron ${filteredTasks.length} tareas ${statusNames[statusNum]}`);
            
            return filteredTasks;
        } catch (error) {
            console.error(`Error filtrando tareas por estado ${status}:`, error.message);
            throw error;
        }
    }

    /**
     * Crea una nueva tarea
     * @param {Object} taskData - Datos de la nueva tarea
     * @param {string} taskData.title - Título de la tarea
     * @param {string} taskData.description - Descripción de la tarea
     * @param {number} [taskData.status=0] - Estado inicial de la tarea
     * @returns {Task} Nueva tarea creada
     */
    createTask(taskData) {
        try {
            // Obtener todas las tareas existentes
            const existingTasks = this.getAllTasks();
            
            // Generar nuevo ID único
            const newId = this.generateNewId(existingTasks);
            
            // Crear nueva instancia de tarea
            const newTask = Task.createNew(taskData, newId);
            
            // Validar la nueva tarea
            const validation = newTask.validate();
            if (!validation.isValid) {
                throw new Error(`Datos de tarea inválidos: ${validation.errors.join(', ')}`);
            }

            // Agregar la nueva tarea al array
            existingTasks.push(newTask);
            
            // Guardar todas las tareas en el archivo
            const success = this.saveTasks(existingTasks);
            if (!success) {
                throw new Error('No se pudo guardar la nueva tarea');
            }

            console.log(`Nueva tarea creada con ID ${newId}: "${newTask.title}"`);
            return newTask;
        } catch (error) {
            console.error('Error creando nueva tarea:', error.message);
            throw error;
        }
    }

    /**
     * Actualiza una tarea existente
     * @param {number} id - ID de la tarea a actualizar
     * @param {Object} updateData - Datos para actualizar
     * @returns {Task} Tarea actualizada
     */
    updateTask(id, updateData) {
        try {
            const tasks = this.getAllTasks();
            const taskIndex = tasks.findIndex(t => t.id === parseInt(id));

            if (taskIndex === -1) {
                throw new Error('Tarea no encontrada');
            }

            // Actualizar la tarea
            const updatedTask = tasks[taskIndex].update(updateData);
            
            // Validar la tarea actualizada
            const validation = updatedTask.validate();
            if (!validation.isValid) {
                throw new Error(`Datos de actualización inválidos: ${validation.errors.join(', ')}`);
            }

            // Guardar los cambios
            const success = this.saveTasks(tasks);
            if (!success) {
                throw new Error('No se pudieron guardar los cambios');
            }

            console.log(`Tarea ${id} actualizada: "${updatedTask.title}"`);
            return updatedTask;
        } catch (error) {
            console.error(`Error actualizando tarea ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Actualiza solo el estado de una tarea
     * @param {number} id - ID de la tarea
     * @param {number} newStatus - Nuevo estado (0, 1, 2)
     * @returns {Task} Tarea con estado actualizado
     */
    updateTaskStatus(id, newStatus) {
        try {
            // Validar el nuevo estado
            const statusNum = parseInt(newStatus);
            if (![0, 1, 2].includes(statusNum)) {
                throw new Error('Estado inválido. Use 0 (pendiente), 1 (en progreso), o 2 (completada)');
            }

            // Actualizar usando el método general
            const updatedTask = this.updateTask(id, { status: statusNum });
            
            const statusNames = { 0: 'pendiente', 1: 'en progreso', 2: 'completada' };
            console.log(`Estado de tarea ${id} cambiado a: ${statusNames[statusNum]}`);
            
            return updatedTask;
        } catch (error) {
            console.error(`Error actualizando estado de tarea ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Elimina una tarea
     * @param {number} id - ID de la tarea a eliminar
     * @returns {Task} Tarea eliminada
     */
    deleteTask(id) {
        try {
            const tasks = this.getAllTasks();
            const taskIndex = tasks.findIndex(t => t.id === parseInt(id));

            if (taskIndex === -1) {
                throw new Error('Tarea no encontrada');
            }

            // Guardar referencia a la tarea eliminada
            const deletedTask = tasks[taskIndex];
            
            // Eliminar la tarea del array
            tasks.splice(taskIndex, 1);
            
            // Guardar los cambios
            const success = this.saveTasks(tasks);
            if (!success) {
                throw new Error('No se pudo eliminar la tarea');
            }

            console.log(`Tarea ${id} eliminada: "${deletedTask.title}"`);
            return deletedTask;
        } catch (error) {
            console.error(`Error eliminando tarea ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas de las tareas
     * @returns {Object} Objeto con estadísticas
     */
    getTasksStats() {
        try {
            const tasks = this.getAllTasks();
            
            const stats = {
                total: tasks.length,
                pending: tasks.filter(t => t.status === 0).length,
                inProgress: tasks.filter(t => t.status === 1).length,
                completed: tasks.filter(t => t.status === 2).length,
                completionRate: 0
            };

            // Calcular porcentaje de completadas
            if (stats.total > 0) {
                stats.completionRate = Math.round((stats.completed / stats.total) * 100);
            }

            console.log(`Estadísticas generadas: ${stats.total} tareas total, ${stats.completed} completadas (${stats.completionRate}%)`);
            return stats;
        } catch (error) {
            console.error('Error generando estadísticas:', error.message);
            throw new Error('No se pudieron generar las estadísticas');
        }
    }

    /**
     * Genera un nuevo ID único para las tareas
     * @param {Task[]} existingTasks - Array de tareas existentes
     * @returns {number} Nuevo ID único
     */
    generateNewId(existingTasks) {
        if (existingTasks.length === 0) {
            return 1;
        }
        
        const maxId = Math.max(...existingTasks.map(task => task.id));
        return maxId + 1;
    }

    /**
     * Guarda el array de tareas en el archivo
     * @param {Task[]} tasks - Array de tareas a guardar
     * @returns {boolean} True si se guardó correctamente
     */
    saveTasks(tasks) {
        try {
            // Convertir las tareas a objetos planos
            const tasksData = tasks.map(task => task.toObject());
            
            // Crear backup antes de guardar
            if (FileUtils.fileExists(this.tasksFile)) {
                FileUtils.createBackup(this.tasksFile);
            }
            
            // Guardar en el archivo
            const success = FileUtils.writeJSONFile(this.tasksFile, tasksData);
            
            if (success) {
                console.log(`${tasks.length} tareas guardadas exitosamente`);
            }
            
            return success;
        } catch (error) {
            console.error('Error guardando tareas:', error.message);
            return false;
        }
    }

    /**
     * Verifica la integridad del archivo de datos
     * @returns {Object} Resultado de la verificación
     */
    checkDataIntegrity() {
        try {
            const fileInfo = FileUtils.getFileInfo(this.tasksFile);
            
            if (!fileInfo) {
                return {
                    isValid: false,
                    message: 'Archivo de datos no encontrado',
                    recommendations: ['Crear archivo tasks.json con array vacío []']
                };
            }

            const tasks = this.getAllTasks();
            const issues = [];

            // Verificar cada tarea
            tasks.forEach((task, index) => {
                const validation = task.validate();
                if (!validation.isValid) {
                    issues.push(`Tarea ${task.id} (posición ${index}): ${validation.errors.join(', ')}`);
                }
            });

            return {
                isValid: issues.length === 0,
                message: issues.length === 0 ? 'Integridad de datos OK' : `Se encontraron ${issues.length} problemas`,
                issues,
                fileInfo,
                totalTasks: tasks.length
            };
        } catch (error) {
            return {
                isValid: false,
                message: 'Error verificando integridad',
                error: error.message
            };
        }
    }
}

module.exports = TaskService;
