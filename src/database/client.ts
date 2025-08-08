// ========================================
// CLIENTE DE BASE DE DATOS PRISMA
// ========================================
// Este archivo configura y exporta el cliente de Prisma
// para interactuar con PostgreSQL

import { PrismaClient } from '@prisma/client';
import { config } from '../config/index';

/**
 * Configuración del cliente Prisma según el entorno
 * Compatible con Prisma 6.13.0
 */
const prismaConfig = {
  // Configuración de logging mejorada para Prisma 6.x
  log: config.nodeEnv === 'development' 
    ? [
        { emit: 'stdout', level: 'query' } as const,
        { emit: 'stdout', level: 'info' } as const,
        { emit: 'stdout', level: 'warn' } as const,
        { emit: 'stdout', level: 'error' } as const
      ]
    : [
        { emit: 'stdout', level: 'error' } as const
      ],
  
  // Configuración de errores
  errorFormat: 'pretty' as const,
} as const;

/**
 * Instancia global del cliente Prisma
 * En desarrollo, se reutiliza la conexión para evitar múltiples instancias
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Cliente Prisma singleton
 * Compatible con Prisma 6.13.0
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaConfig);

if (config.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Conecta a la base de datos y verifica la conexión
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    
    // Verificar la conexión con una consulta simple
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Base de datos respondiendo correctamente');
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    throw error;
  }
}

/**
 * Desconecta de la base de datos de forma graceful
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Desconexión de la base de datos completada');
  } catch (error) {
    console.error('❌ Error desconectando de la base de datos:', error);
    throw error;
  }
}

/**
 * Verifica el estado de la base de datos
 * Compatible con Prisma 6.13.0
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: Date;
  responseTime?: number;
}> {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1 as test`;
    const duration = Date.now() - start;
    
    return {
      status: 'healthy',
      message: `Base de datos PostgreSQL respondiendo correctamente`,
      responseTime: duration,
      timestamp: new Date()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Health check fallido:', errorMessage);
    
    return {
      status: 'unhealthy',
      message: `Error en la base de datos: ${errorMessage}`,
      timestamp: new Date()
    };
  }
}

/**
 * Obtiene información del cliente Prisma y la base de datos
 */
export async function getDatabaseInfo(): Promise<{
  prismaVersion: string;
  databaseType: string;
  connectionStatus: 'connected' | 'disconnected';
  timestamp: Date;
}> {
  try {
    // Verificar conexión
    await prisma.$queryRaw`SELECT version() as db_version`;
    
    return {
      prismaVersion: '6.13.0',
      databaseType: 'PostgreSQL',
      connectionStatus: 'connected',
      timestamp: new Date()
    };
  } catch (error) {
    return {
      prismaVersion: '6.13.0',
      databaseType: 'PostgreSQL',
      connectionStatus: 'disconnected',
      timestamp: new Date()
    };
  }
}

/**
 * Ejecuta una transacción de forma segura
 * Compatible con Prisma 6.13.0
 */
export async function executeTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(async (tx: any) => {
      return await callback(tx as PrismaClient);
    }, {
      timeout: 10000, // 10 segundos
      maxWait: 5000,  // 5 segundos de espera máxima
    });
  } catch (error) {
    console.error('❌ Error en transacción:', error);
    throw error;
  }
}

// Manejo graceful del cierre de la aplicación
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});
