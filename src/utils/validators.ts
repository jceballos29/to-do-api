// ========================================
// UTILIDADES DE VALIDACIÓN
// ========================================
// Funciones de validación para la API de tareas

import { TaskStatus, TaskPriority } from '@/types';
import { AppError } from './AppError';

/**
 * Interfaz para parámetros de paginación
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Interfaz para paginación validada
 */
export interface ValidatedPagination {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Validar y normalizar parámetros de paginación
 */
export function validatePagination(params: PaginationParams): ValidatedPagination {
  const { page, limit } = params;

  // Validar página
  if (!Number.isInteger(page) || page < 1) {
    throw new AppError('La página debe ser un número entero mayor a 0', 400, 'INVALID_PAGE');
  }

  // Validar límite
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError('El límite debe ser un número entero entre 1 y 100', 400, 'INVALID_LIMIT');
  }

  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
}

/**
 * Validar estado de tarea (acepta número o string)
 */
export function validateTaskStatus(status: any): TaskStatus {
  // Si es número, convertir a enum
  if (typeof status === 'number') {
    switch (status) {
      case 0:
        return TaskStatus.PENDING;
      case 1:
        return TaskStatus.IN_PROGRESS;
      case 2:
        return TaskStatus.COMPLETED;
      default:
        throw new AppError(
          'Estado de tarea inválido. Debe ser 0 (Pendiente), 1 (En progreso) o 2 (Completada)',
          400,
          'INVALID_TASK_STATUS'
        );
    }
  }

  // Si es string, validar que sea un valor válido del enum
  if (typeof status === 'string') {
    const upperStatus = status.toUpperCase();
    if (Object.values(TaskStatus).includes(upperStatus as TaskStatus)) {
      return upperStatus as TaskStatus;
    }
  }

  throw new AppError(
    `Estado de tarea inválido: ${status}. Valores válidos: PENDING, IN_PROGRESS, COMPLETED, 0, 1, 2`,
    400,
    'INVALID_TASK_STATUS'
  );
}

/**
 * Validar prioridad de tarea
 */
export function validateTaskPriority(priority: any): TaskPriority {
  if (typeof priority === 'string') {
    const upperPriority = priority.toUpperCase();
    if (Object.values(TaskPriority).includes(upperPriority as TaskPriority)) {
      return upperPriority as TaskPriority;
    }
  }

  throw new AppError(
    `Prioridad de tarea inválida: ${priority}. Valores válidos: LOW, MEDIUM, HIGH`,
    400,
    'INVALID_TASK_PRIORITY'
  );
}

/**
 * Validar campo de ordenamiento
 */
export function validateSortField(sortBy: any): 'createdAt' | 'updatedAt' | 'title' | 'priority' {
  const validSortFields = ['createdAt', 'updatedAt', 'title', 'priority'];
  
  if (typeof sortBy === 'string' && validSortFields.includes(sortBy)) {
    return sortBy as 'createdAt' | 'updatedAt' | 'title' | 'priority';
  }

  throw new AppError(
    `Campo de ordenamiento inválido: ${sortBy}. Valores válidos: ${validSortFields.join(', ')}`,
    400,
    'INVALID_SORT_FIELD'
  );
}

/**
 * Validar orden de clasificación
 */
export function validateSortOrder(sortOrder: any): 'asc' | 'desc' {
  if (typeof sortOrder === 'string') {
    const lowerOrder = sortOrder.toLowerCase();
    if (lowerOrder === 'asc' || lowerOrder === 'desc') {
      return lowerOrder;
    }
  }

  throw new AppError(
    `Orden de clasificación inválido: ${sortOrder}. Valores válidos: asc, desc`,
    400,
    'INVALID_SORT_ORDER'
  );
}

/**
 * Validar ID de tarea
 */
export function validateTaskId(id: any): number {
  const taskId = parseInt(id, 10);
  
  if (isNaN(taskId) || taskId <= 0) {
    throw new AppError('ID de tarea inválido. Debe ser un número entero positivo', 400, 'INVALID_TASK_ID');
  }

  return taskId;
}

/**
 * Validar título de tarea
 */
export function validateTaskTitle(title: any): string {
  if (!title || typeof title !== 'string') {
    throw new AppError('El título es requerido y debe ser texto', 400, 'INVALID_TITLE');
  }

  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length < 3) {
    throw new AppError('El título debe tener al menos 3 caracteres', 400, 'TITLE_TOO_SHORT');
  }

  if (trimmedTitle.length > 255) {
    throw new AppError('El título no puede tener más de 255 caracteres', 400, 'TITLE_TOO_LONG');
  }

  return trimmedTitle;
}

/**
 * Validar descripción de tarea
 */
export function validateTaskDescription(description: any): string {
  if (!description || typeof description !== 'string') {
    throw new AppError('La descripción es requerida y debe ser texto', 400, 'INVALID_DESCRIPTION');
  }

  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length < 5) {
    throw new AppError('La descripción debe tener al menos 5 caracteres', 400, 'DESCRIPTION_TOO_SHORT');
  }

  if (trimmedDescription.length > 2000) {
    throw new AppError('La descripción no puede tener más de 2000 caracteres', 400, 'DESCRIPTION_TOO_LONG');
  }

  return trimmedDescription;
}

/**
 * Validar término de búsqueda
 */
export function validateSearchTerm(search: any): string {
  if (typeof search !== 'string') {
    throw new AppError('El término de búsqueda debe ser texto', 400, 'INVALID_SEARCH_TERM');
  }

  const trimmedSearch = search.trim();
  
  if (trimmedSearch.length < 2) {
    throw new AppError('El término de búsqueda debe tener al menos 2 caracteres', 400, 'SEARCH_TOO_SHORT');
  }

  if (trimmedSearch.length > 100) {
    throw new AppError('El término de búsqueda no puede tener más de 100 caracteres', 400, 'SEARCH_TOO_LONG');
  }

  return trimmedSearch;
}

/**
 * Sanitizar string para prevenir XSS básico
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validar email (para futuras funcionalidades)
 */
export function validateEmail(email: any): string {
  if (typeof email !== 'string') {
    throw new AppError('El email debe ser texto', 400, 'INVALID_EMAIL_TYPE');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new AppError('El formato del email es inválido', 400, 'INVALID_EMAIL_FORMAT');
  }

  return email.toLowerCase().trim();
}

/**
 * Validar que un objeto tenga al menos una propiedad para actualizar
 */
export function validateHasUpdateFields(data: Record<string, any>, allowedFields: string[]): void {
  const providedFields = Object.keys(data).filter(key => allowedFields.includes(key));
  
  if (providedFields.length === 0) {
    throw new AppError(
      `Debe proporcionar al menos un campo para actualizar. Campos permitidos: ${allowedFields.join(', ')}`,
      400,
      'NO_UPDATE_FIELDS'
    );
  }
}

/**
 * Validar rango de fechas (para futuras funcionalidades de filtros)
 */
export function validateDateRange(startDate: any, endDate: any): { start: Date; end: Date } {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    throw new AppError('Fecha de inicio inválida', 400, 'INVALID_START_DATE');
  }

  if (isNaN(end.getTime())) {
    throw new AppError('Fecha de fin inválida', 400, 'INVALID_END_DATE');
  }

  if (start >= end) {
    throw new AppError('La fecha de inicio debe ser anterior a la fecha de fin', 400, 'INVALID_DATE_RANGE');
  }

  return { start, end };
}
