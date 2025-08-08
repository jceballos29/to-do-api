// ========================================
// CLASE DE ERROR PERSONALIZADA
// ========================================
// Error extendido con información adicional para la API

/**
 * Error personalizado de la aplicación con información adicional
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Mantener el stack trace correcto
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convertir el error a objeto JSON para respuestas
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Crear error de validación
   */
  static validation(message: string, details?: any): AppError {
    return new AppError(message, 400, 'VALIDATION_ERROR', true, details);
  }

  /**
   * Crear error de recurso no encontrado
   */
  static notFound(resource: string, id?: string | number): AppError {
    const message = id 
      ? `${resource} con ID ${id} no encontrado`
      : `${resource} no encontrado`;
    return new AppError(message, 404, 'NOT_FOUND', true);
  }

  /**
   * Crear error de conflicto
   */
  static conflict(message: string): AppError {
    return new AppError(message, 409, 'CONFLICT', true);
  }

  /**
   * Crear error de autorización
   */
  static unauthorized(message: string = 'No autorizado'): AppError {
    return new AppError(message, 401, 'UNAUTHORIZED', true);
  }

  /**
   * Crear error de acceso denegado
   */
  static forbidden(message: string = 'Acceso denegado'): AppError {
    return new AppError(message, 403, 'FORBIDDEN', true);
  }

  /**
   * Crear error interno del servidor
   */
  static internal(message: string = 'Error interno del servidor'): AppError {
    return new AppError(message, 500, 'INTERNAL_SERVER_ERROR', false);
  }
}
