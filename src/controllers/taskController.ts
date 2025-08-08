// ========================================
// CONTROLADOR DE TAREAS - TYPESCRIPT PROFESSIONAL
// ========================================
// Controlador completo con Prisma, validaciones y type safety

import { Request, Response } from 'express';
import { 
  taskService,
  TaskService, 
  CreateTaskDto, 
  UpdateTaskDto, 
  TaskQueryParams,
  PaginatedResponse,
  TaskStats 
} from '@/services/taskService';
import { AppError } from '@/utils/AppError';
import { 
  validatePagination, 
  validateTaskStatus, 
  validateTaskPriority
} from '@/utils/validators';

/**
 * Controlador de tareas con funcionalidad completa
 */
export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = taskService;
    console.log('TaskController inicializado');
  }

  /**
   * GET /api/tasks - Obtener todas las tareas con filtros y paginación
   */
  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = '1',
        limit = '10',
        status,
        priority,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Validar parámetros de paginación
      const pagination = validatePagination({
        page: Number(page),
        limit: Number(limit)
      });

      // Construir parámetros de consulta
      const queryParams: TaskQueryParams = {
        ...pagination,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      // Validar y agregar filtros opcionales
      if (status) {
        queryParams.status = validateTaskStatus(Number(status));
      }

      if (priority) {
        queryParams.priority = validateTaskPriority(priority as string);
      }

      if (search) {
        queryParams.search = search as string;
      }

      // Obtener tareas del servicio
      const result: PaginatedResponse<any> = await this.taskService.getAllTasks(queryParams);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          totalItems: result.pagination.totalItems,
          itemsPerPage: result.pagination.itemsPerPage,
          hasNextPage: result.pagination.hasNextPage,
          hasPreviousPage: result.pagination.hasPreviousPage
        },
        filters: {
          status: queryParams.status,
          priority: queryParams.priority,
          search: queryParams.search
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * GET /api/tasks/stats - Obtener estadísticas de tareas
   */
  async getTaskStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats: TaskStats = await this.taskService.getTaskStats();

      res.status(200).json({
        success: true,
        message: 'Estadísticas de tareas obtenidas exitosamente',
        data: stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * GET /api/tasks/:id - Obtener tarea por ID
   */
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = parseInt(id, 10);

      if (isNaN(taskId) || taskId <= 0) {
        throw new AppError('ID de tarea inválido', 400, 'INVALID_TASK_ID');
      }

      const task = await this.taskService.getTaskById(taskId);

      if (!task) {
        throw new AppError(`Tarea con ID ${taskId} no encontrada`, 404, 'TASK_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        message: 'Tarea obtenida exitosamente',
        data: task,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * POST /api/tasks - Crear nueva tarea
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const taskData: CreateTaskDto = this.validateCreateTaskData(req.body);
      
      const newTask = await this.taskService.createTask(taskData);

      res.status(201).json({
        success: true,
        message: 'Tarea creada exitosamente',
        data: newTask,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * PUT /api/tasks/:id - Actualizar tarea completa
   */
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = parseInt(id, 10);

      if (isNaN(taskId) || taskId <= 0) {
        throw new AppError('ID de tarea inválido', 400, 'INVALID_TASK_ID');
      }

      const updateData: UpdateTaskDto = this.validateUpdateTaskData(req.body);
      
      const updatedTask = await this.taskService.updateTask(taskId, updateData);

      res.status(200).json({
        success: true,
        message: 'Tarea actualizada exitosamente',
        data: updatedTask,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * PATCH /api/tasks/:id/status - Actualizar solo el estado de la tarea
   */
  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const taskId = parseInt(id, 10);

      if (isNaN(taskId) || taskId <= 0) {
        throw new AppError('ID de tarea inválido', 400, 'INVALID_TASK_ID');
      }

      const validStatus = validateTaskStatus(status);
      
      const updatedTask = await this.taskService.updateTaskStatus(taskId, validStatus);

      res.status(200).json({
        success: true,
        message: `Estado de tarea actualizado exitosamente`,
        data: updatedTask,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * DELETE /api/tasks/:id - Eliminar tarea
   */
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const taskId = parseInt(id, 10);

      if (isNaN(taskId) || taskId <= 0) {
        throw new AppError('ID de tarea inválido', 400, 'INVALID_TASK_ID');
      }

      await this.taskService.deleteTask(taskId);

      res.status(200).json({
        success: true,
        message: 'Tarea eliminada exitosamente',
        deletedTaskId: taskId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Validar datos para crear tarea
   */
  private validateCreateTaskData(data: any): CreateTaskDto {
    if (!data || typeof data !== 'object') {
      throw new AppError('Datos de tarea inválidos', 400, 'INVALID_TASK_DATA');
    }

    const { title, description, priority } = data;

    // Validar título
    if (!title || typeof title !== 'string') {
      throw new AppError('El título es requerido y debe ser texto', 400, 'INVALID_TITLE');
    }

    if (title.trim().length < 3 || title.trim().length > 255) {
      throw new AppError('El título debe tener entre 3 y 255 caracteres', 400, 'INVALID_TITLE_LENGTH');
    }

    // Validar descripción
    if (!description || typeof description !== 'string') {
      throw new AppError('La descripción es requerida y debe ser texto', 400, 'INVALID_DESCRIPTION');
    }

    if (description.trim().length < 5) {
      throw new AppError('La descripción debe tener al menos 5 caracteres', 400, 'INVALID_DESCRIPTION_LENGTH');
    }

    const taskData: CreateTaskDto = {
      title: title.trim(),
      description: description.trim()
    };

    // Validar prioridad opcional
    if (priority !== undefined) {
      taskData.priority = validateTaskPriority(priority);
    }

    return taskData;
  }

  /**
   * Validar datos para actualizar tarea
   */
  private validateUpdateTaskData(data: any): UpdateTaskDto {
    if (!data || typeof data !== 'object') {
      throw new AppError('Datos de actualización inválidos', 400, 'INVALID_UPDATE_DATA');
    }

    const updateData: UpdateTaskDto = {};

    // Validar título si se proporciona
    if (data.title !== undefined) {
      if (typeof data.title !== 'string') {
        throw new AppError('El título debe ser texto', 400, 'INVALID_TITLE');
      }
      
      if (data.title.trim().length < 3 || data.title.trim().length > 255) {
        throw new AppError('El título debe tener entre 3 y 255 caracteres', 400, 'INVALID_TITLE_LENGTH');
      }
      
      updateData.title = data.title.trim();
    }

    // Validar descripción si se proporciona
    if (data.description !== undefined) {
      if (typeof data.description !== 'string') {
        throw new AppError('La descripción debe ser texto', 400, 'INVALID_DESCRIPTION');
      }
      
      if (data.description.trim().length < 5) {
        throw new AppError('La descripción debe tener al menos 5 caracteres', 400, 'INVALID_DESCRIPTION_LENGTH');
      }
      
      updateData.description = data.description.trim();
    }

    // Validar estado si se proporciona
    if (data.status !== undefined) {
      updateData.status = validateTaskStatus(data.status);
    }

    // Validar prioridad si se proporciona
    if (data.priority !== undefined) {
      updateData.priority = validateTaskPriority(data.priority);
    }

    // Verificar que al menos un campo se actualice
    if (Object.keys(updateData).length === 0) {
      throw new AppError('Debe proporcionar al menos un campo para actualizar', 400, 'NO_UPDATE_FIELDS');
    }

    return updateData;
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: any, res: Response): void {
    console.error('Error en TaskController:', error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }
}

// Exportar instancia del controlador
export const taskController = new TaskController();
