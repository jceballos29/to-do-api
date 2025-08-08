// ========================================
// DEFINICIONES DE TIPOS GLOBALES
// ========================================
// Este archivo contiene todas las interfaces y tipos TypeScript
// utilizados en toda la aplicación

import { Request, Response } from 'express';

// ==========================================
// TIPOS DE BASE DE DATOS (Prisma)
// ==========================================

/**
 * Estados posibles de una tarea
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

/**
 * Niveles de prioridad de una tarea
 */
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

// ==========================================
// INTERFACES DE DATOS
// ==========================================

/**
 * Estructura completa de una tarea en la base de datos
 */
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Datos requeridos para crear una nueva tarea
 */
export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

/**
 * Datos para actualizar una tarea existente
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

/**
 * Datos para actualizar solo el estado de una tarea
 */
export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

// ==========================================
// TIPOS DE FILTROS Y CONSULTAS
// ==========================================

/**
 * Parámetros de consulta para filtrar tareas
 */
export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Respuesta paginada para listas de tareas
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ==========================================
// TIPOS DE RESPUESTAS API
// ==========================================

/**
 * Estructura estándar de respuesta exitosa
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  timestamp: string;
}

/**
 * Estructura estándar de respuesta de error
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * Tipo union para respuestas de API
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ==========================================
// TIPOS DE ESTADÍSTICAS
// ==========================================

/**
 * Estadísticas generales de las tareas
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
  recentlyCreated: number; // Tareas creadas en las últimas 24 horas
  completionRate: number; // Porcentaje de tareas completadas
}

// ==========================================
// TIPOS DE CONTROLADORES
// ==========================================

/**
 * Request tipado con parámetros de ID
 */
export interface RequestWithId extends Request {
  params: {
    id: string;
  };
}

/**
 * Request tipado para crear tareas
 */
export interface CreateTaskRequest extends Request {
  body: CreateTaskDto;
}

/**
 * Request tipado para actualizar tareas
 */
export interface UpdateTaskRequest extends RequestWithId {
  body: UpdateTaskDto;
}

/**
 * Request tipado para actualizar estado de tarea
 */
export interface UpdateTaskStatusRequest extends RequestWithId {
  body: UpdateTaskStatusDto;
}

/**
 * Request tipado con query parameters para filtros
 */
export interface TaskQueryRequest extends Request {
  query: any; // Permitir cualquier tipo de query params
}

// ==========================================
// TIPOS DE CONFIGURACIÓN
// ==========================================

/**
 * Configuración de la aplicación
 */
export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
  apiVersion: string;
  apiName: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

// ==========================================
// TIPOS DE SERVICIOS
// ==========================================

/**
 * Opciones para paginación
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Opciones para ordenamiento
 */
export interface SortOptions {
  field: 'createdAt' | 'updatedAt' | 'title' | 'priority';
  order: 'asc' | 'desc';
}

/**
 * Opciones completas para consultas de tareas
 */
export interface TaskQueryOptions {
  filters?: {
    status?: TaskStatus;
    priority?: TaskPriority;
  };
  pagination?: PaginationOptions;
  sort?: SortOptions;
}

// ==========================================
// TIPOS DE MIDDLEWARE
// ==========================================

/**
 * Función de middleware personalizada
 */
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * Next function de Express
 */
export type NextFunction = () => void;

// ==========================================
// TIPOS DE VALIDACIÓN
// ==========================================

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: {
    field: string;
    message: string;
  }[];
}

/**
 * Schema de validación personalizado
 */
export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
    minLength?: number;
    maxLength?: number;
    enum?: string[];
    custom?: (value: any) => boolean;
  };
}

// ==========================================
// TIPOS DE ERROR PERSONALIZADOS
// ==========================================

/**
 * Error personalizado de la aplicación
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ==========================================
// MAPEO DE ENUMS A NÚMEROS (COMPATIBILIDAD)
// ==========================================

/**
 * Mapeo de status enum a números para compatibilidad con API anterior
 */
export const TaskStatusToNumber: Record<TaskStatus, number> = {
  [TaskStatus.PENDING]: 0,
  [TaskStatus.IN_PROGRESS]: 1,
  [TaskStatus.COMPLETED]: 2
};

/**
 * Mapeo de números a status enum para compatibilidad con API anterior
 */
export const NumberToTaskStatus: Record<number, TaskStatus> = {
  0: TaskStatus.PENDING,
  1: TaskStatus.IN_PROGRESS,
  2: TaskStatus.COMPLETED
};

/**
 * Nombres legibles de los estados
 */
export const TaskStatusNames: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: 'Pendiente',
  [TaskStatus.IN_PROGRESS]: 'En progreso',
  [TaskStatus.COMPLETED]: 'Completada'
};

/**
 * Nombres legibles de las prioridades
 */
export const TaskPriorityNames: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Baja',
  [TaskPriority.MEDIUM]: 'Media',
  [TaskPriority.HIGH]: 'Alta'
};
