import { PrismaClient } from '@prisma/client';
import { config } from '@/config';
import { logger } from '@/utils/logger.service';

/**
 * Configuración del cliente Prisma según el entorno.
 * Es compatible con Prisma 6.13.0
 */
const prismaConfig = {
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
  errorFormat: 'pretty' as const,
} as const;

/**
 * Implementación del patrón Singleton para el cliente de Prisma.
 * Esto asegura que solo haya una instancia de Prisma en toda la aplicación.
 */
class PrismaClientSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient(prismaConfig);
    }
    return PrismaClientSingleton.instance;
  }
}

export const prisma = PrismaClientSingleton.getInstance();

// --- Funciones de Utilidad y Diagnóstico ---

/**
 * Conecta a la base de datos y verifica la conexión.
 * @returns Promesa que se resuelve al conectar exitosamente.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('DATABASE CONNECTION: established');

    // Verificar la conexión con una consulta simple
    await prisma.$queryRaw`SELECT 1`;
    logger.info('DATABASE RESPONSE: OK');

  } catch (error) {
    logger.error(error, 'Error connecting to the database:');
    throw error;
  }
}

/**
 * Desconecta de la base de datos de forma segura.
 * @returns Promesa que se resuelve al desconectar exitosamente.
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('DATABASE DISCONNECTION: completed');
  } catch (error) {
    logger.error(error, 'Error disconnecting from the database:');
    throw error;
  }
}

/**
 * Verifica el estado de la base de datos (Health Check).
 * Ideal para endpoints de monitoreo de estado.
 * @returns Objeto con el estado de la salud de la base de datos.
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: Date;
  responseTime?: number;
}> {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const duration = Date.now() - start;
    
    return {
      status: 'healthy',
      message: `PostgreSQL database responding correctly`,
      responseTime: duration,
      timestamp: new Date()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'unhealthy',
      message: `Database error: ${errorMessage}`,
      timestamp: new Date()
    };
  }
}

/**
 * Obtiene información del cliente Prisma y la base de datos.
 * @returns Objeto con información relevante de la conexión.
 */
export async function getDatabaseInfo(): Promise<{
  prismaVersion: string;
  databaseType: string;
  connectionStatus: 'connected' | 'disconnected';
  timestamp: Date;
}> {
  try {
    await prisma.$queryRaw`SELECT version()`;
    
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
 * Ejecuta una transacción de forma segura, garantizando la atomicidad.
 * @param callback - Función que contiene las operaciones de la base de datos.
 * @returns Resultado de la transacción.
 */
export async function executeTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx as PrismaClient);
    }, {
      timeout: 10000,
      maxWait: 5000,
    });
  } catch (error) {
    logger.error(error, 'Error executing transaction:');
    throw error;
  }
}