// ========================================
// CONTROLADOR PRINCIPAL - TYPESCRIPT
// ========================================
// Controlador para endpoints generales de la API

import { Request, Response } from 'express';

/**
 * Interfaz para la respuesta de información de la API
 */
interface ApiInfo {
  message: string;
  version: string;
  architecture: string;
  features: string[];
  timestamp: string;
}

/**
 * Controlador principal para endpoints generales
 */
export class MainController {
  constructor() {
    console.log('MainController inicializado');
  }
  /**
   * Endpoint principal - Información de la API profesional
   */
  async getApiInfo(_req: Request, res: Response): Promise<void> {
    const apiInfo: ApiInfo = {
      message: '🚀 TODO API Professional v3.0',
      version: '3.0.0',
      architecture: 'TypeScript + PostgreSQL + Prisma ORM',
      features: [
        '✅ Type Safety completo con TypeScript',
        '🗃️ PostgreSQL como base de datos',
        '🔧 Prisma ORM para consultas type-safe',
        '📊 Paginación y filtros avanzados',
        '📈 Estadísticas de tareas',
        '🛡️ Validaciones robustas',
        '🏗️ Arquitectura hexagonal',
        '🔄 Migraciones de base de datos',
        '⚡ Hot-reload en desarrollo',
        '🎯 Preparado para producción'
      ],
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: apiInfo
    });
  }

  /**
   * Health check del servidor
   */
  async getHealthCheck(_req: Request, res: Response): Promise<void> {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'] || 'development',
      version: '3.0.0'
    };

    res.status(200).json({
      success: true,
      data: health
    });
  }

  /**
   * Comparación entre versiones
   */
  async getVersionComparison(_req: Request, res: Response): Promise<void> {
    const comparison = {
      'v1.0 (Monolítico)': {
        technology: 'JavaScript puro',
        database: 'JSON file',
        architecture: 'Todo en un archivo',
        features: ['CRUD básico', 'Sin validaciones', 'Sin tipos']
      },
      'v2.0 (MVC)': {
        technology: 'JavaScript + Express',
        database: 'JSON file',
        architecture: 'MVC separado',
        features: ['CRUD completo', 'Validaciones básicas', 'Arquitectura organizada']
      },
      'v3.0 (Professional)': {
        technology: 'TypeScript + Express',
        database: 'PostgreSQL + Prisma',
        architecture: 'Hexagonal + Type-safe',
        features: [
          'Type safety completo',
          'Base de datos profesional',
          'Paginación avanzada',
          'Estadísticas',
          'Validaciones robustas',
          'Manejo de errores profesional',
          'Preparado para scaling'
        ]
      }
    };

    res.status(200).json({
      success: true,
      message: 'Evolución de la TODO API',
      data: comparison,
      timestamp: new Date().toISOString()
    });
  }
}

// Exportar instancia del controlador
export const mainController = new MainController();
