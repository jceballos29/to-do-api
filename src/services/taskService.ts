// ========================================
// SERVICIO DE TAREAS - CAPA DE NEGOCIO
// ========================================
// Este servicio maneja toda la lógica de negocio relacionada con las tareas

import { prisma } from '@/database/client';
import { AppError } from '@/utils/AppError';

/**
 * DTO para crear una nueva tarea
 */
export interface CreateTaskDto {
  title: string;
  description: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * DTO para actualizar una tarea existente
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Parámetros de consulta para filtrar tareas
 */
export interface TaskQueryParams {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Estadísticas de tareas
 */
export interface TaskStats {
  total: number;
  byStatus: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  recentlyCreated: number;
  completionRate: number;
}

/**
 * Servicio principal para el manejo de tareas
 */
export class TaskService {
  /**
   * Obtiene todas las tareas con filtros opcionales y paginación
   */
  async getAllTasks(params: TaskQueryParams): Promise<PaginatedResponse<any>> {
    try {
      const offset = (params.page - 1) * params.limit;

      // Construir filtros
      const where: any = {};
      if (params.status) {
        where.status = params.status;
      }
      if (params.priority) {
        where.priority = params.priority;
      }
      if (params.search) {
        where.OR = [
          { title: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } }
        ];
      }

      // Ejecutar consultas en paralelo
      const [tasks, totalCount] = await Promise.all([
        prisma.task.findMany({
          where,
          skip: offset,
          take: params.limit,
          orderBy: { [params.sortBy]: params.sortOrder }
        }),
        prisma.task.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / params.limit);

      return {
        data: tasks,
        pagination: {
          currentPage: params.page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: params.limit,
          hasNextPage: params.page < totalPages,
          hasPreviousPage: params.page > 1
        }
      };
    } catch (error) {
      console.error('Error en getAllTasks:', error);
      throw new AppError('Error obteniendo las tareas', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Obtiene una tarea por su ID
   */
  async getTaskById(id: number): Promise<any> {
    try {
      const task = await prisma.task.findUnique({
        where: { id }
      });

      if (!task) {
        throw new AppError('Tarea no encontrada', 404, 'TASK_NOT_FOUND');
      }

      return task;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error en getTaskById:', error);
      throw new AppError('Error obteniendo la tarea', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Crea una nueva tarea
   */
  async createTask(taskData: CreateTaskDto): Promise<any> {
    try {
      const task = await prisma.task.create({
        data: {
          title: taskData.title.trim(),
          description: taskData.description.trim(),
          status: 'PENDING',
          priority: taskData.priority || 'MEDIUM'
        }
      });

      return task;
    } catch (error) {
      console.error('Error en createTask:', error);
      throw new AppError('Error creando la tarea', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(id: number, taskData: UpdateTaskDto): Promise<any> {
    try {
      // Verificar que la tarea existe
      await this.getTaskById(id);

      // Preparar datos para actualizar
      const updateData: any = {};
      if (taskData.title !== undefined) {
        updateData.title = taskData.title.trim();
      }
      if (taskData.description !== undefined) {
        updateData.description = taskData.description.trim();
      }
      if (taskData.status !== undefined) {
        updateData.status = taskData.status;
      }
      if (taskData.priority !== undefined) {
        updateData.priority = taskData.priority;
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: updateData
      });

      return updatedTask;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error en updateTask:', error);
      throw new AppError('Error actualizando la tarea', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Actualiza solo el estado de una tarea
   */
  async updateTaskStatus(id: number, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'): Promise<any> {
    try {
      // Verificar que la tarea existe
      await this.getTaskById(id);

      const updatedTask = await prisma.task.update({
        where: { id },
        data: { status }
      });

      return updatedTask;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error en updateTaskStatus:', error);
      throw new AppError('Error actualizando el estado de la tarea', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id: number): Promise<void> {
    try {
      // Verificar que la tarea existe
      await this.getTaskById(id);

      await prisma.task.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error en deleteTask:', error);
      throw new AppError('Error eliminando la tarea', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Obtiene estadísticas de las tareas
   */
  async getTaskStats(): Promise<TaskStats> {
    try {
      const [
        total,
        pendingCount,
        inProgressCount,
        completedCount,
        lowPriorityCount,
        mediumPriorityCount,
        highPriorityCount,
        recentCount
      ] = await Promise.all([
        prisma.task.count(),
        prisma.task.count({ where: { status: 'PENDING' } }),
        prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.task.count({ where: { status: 'COMPLETED' } }),
        prisma.task.count({ where: { priority: 'LOW' } }),
        prisma.task.count({ where: { priority: 'MEDIUM' } }),
        prisma.task.count({ where: { priority: 'HIGH' } }),
        prisma.task.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
            }
          }
        })
      ]);

      const completionRate = total > 0 ? (completedCount / total) * 100 : 0;

      return {
        total,
        byStatus: {
          pending: pendingCount,
          inProgress: inProgressCount,
          completed: completedCount
        },
        byPriority: {
          low: lowPriorityCount,
          medium: mediumPriorityCount,
          high: highPriorityCount
        },
        recentlyCreated: recentCount,
        completionRate: Math.round(completionRate * 100) / 100
      };
    } catch (error) {
      console.error('Error en getTaskStats:', error);
      throw new AppError('Error obteniendo estadísticas de tareas', 500, 'DATABASE_ERROR');
    }
  }
}

// Exportar instancia singleton del servicio
export const taskService = new TaskService();
