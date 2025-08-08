import { checkDatabaseHealth } from '@/utils/prisma.client';
import { Request, Response } from 'express';
import { config } from '@/config';

interface ApiInfo {
  message: string;
  version: string;
  architecture: string;
  features: string[];
  timestamp: string;
}

export class MainController {
  public async getApiInfo(_req: Request, res: Response): Promise<void> {
    const apiInfo: ApiInfo = {
      message: '🚀 Task Tracer API',
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

  public async getHealthCheck(_req: Request, res: Response): Promise<void> {
    const databaseHealth = await checkDatabaseHealth();
    res.status(200).json({
      success: true,
      data: {
        status: databaseHealth.status,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
        version: config.apiVersion
      }
    });
  }

  public async getVersionComparison(_req: Request, res: Response): Promise<void> {
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