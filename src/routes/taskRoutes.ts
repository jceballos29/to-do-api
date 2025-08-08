// ========================================
// RUTAS DE TAREAS - TYPESCRIPT PROFESSIONAL
// ========================================
// Configuración completa de rutas para el CRUD de tareas

import { Router } from 'express';
import { taskController } from '@/controllers/taskController';

/**
 * Router para rutas de tareas
 */
const router: Router = Router();

/**
 * GET /api/tasks - Obtener todas las tareas con filtros y paginación
 * Query params: page, limit, status, priority, search, sortBy, sortOrder
 */
router.get('/', taskController.getAllTasks.bind(taskController));

/**
 * GET /api/tasks/stats - Obtener estadísticas de tareas
 */
router.get('/stats', taskController.getTaskStats.bind(taskController));

/**
 * GET /api/tasks/:id - Obtener tarea específica por ID
 */
router.get('/:id', taskController.getTaskById.bind(taskController));

/**
 * POST /api/tasks - Crear nueva tarea
 * Body: { title, description, priority? }
 */
router.post('/', taskController.createTask.bind(taskController));

/**
 * PUT /api/tasks/:id - Actualizar tarea completa
 * Body: { title?, description?, status?, priority? }
 */
router.put('/:id', taskController.updateTask.bind(taskController));

/**
 * PATCH /api/tasks/:id/status - Actualizar solo el estado de la tarea
 * Body: { status }
 */
router.patch('/:id/status', taskController.updateTaskStatus.bind(taskController));

/**
 * DELETE /api/tasks/:id - Eliminar tarea
 */
router.delete('/:id', taskController.deleteTask.bind(taskController));

export { router as taskRoutes };
