import dotenv from 'dotenv';
import { z } from 'zod';
import { AppConfig } from '@/types'; // Asume que AppConfig se define aquí

// Cargar variables de entorno del archivo .env
dotenv.config();

// Esquema de validación para las variables de entorno
const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL es requerida" }),
  JWT_SECRET: z.string().min(1, { message: "JWT_SECRET es requerida" }),
  JWT_EXPIRES_IN: z.string().default('24h'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  API_VERSION: z.string().default('3.0.0'),
  API_NAME: z.string().default('TODO API Professional'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Parsea y valida las variables de entorno
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Error en la configuración de las variables de entorno:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Configuración de variables de entorno no válida. Por favor, revisa tu archivo .env');
}

const env = parsedEnv.data;

/**
 * Configuración principal de la aplicación
 */
export const config: AppConfig = {
  // Configuración del servidor
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,

  // Configuración de base de datos
  databaseUrl: env.DATABASE_URL,

  // Configuración de JWT
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,

  // Configuración de CORS
  corsOrigin: env.CORS_ORIGIN,

  // Información de la API
  apiVersion: env.API_VERSION,
  apiName: env.API_NAME,

  // Configuración de logging
  logLevel: env.LOG_LEVEL,
};

/**
 * Constantes de la aplicación
 */
export const constants = {
  // Paginación
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Validaciones
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 255,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,

  // Códigos de error personalizados
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    DATABASE_ERROR: 'DATABASE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_SERVER_ERROR'
  } as const,

  // Headers HTTP personalizados
  CUSTOM_HEADERS: {
    API_VERSION: 'X-API-Version',
    REQUEST_ID: 'X-Request-ID',
    RATE_LIMIT: 'X-RateLimit-Limit',
    RATE_REMAINING: 'X-RateLimit-Remaining'
  } as const
} as const;

/**
 * Configuración específica por entorno
 */
export const environmentConfig = {
  development: {
    enableDetailedErrors: true,
    enableRequestLogging: true,
    enableCors: true
  },
  production: {
    enableDetailedErrors: false,
    enableRequestLogging: false,
    enableCors: false
  },
  test: {
    enableDetailedErrors: true,
    enableRequestLogging: false,
    enableCors: true
  }
} as const;

/**
 * Obtiene la configuración específica del entorno actual
 */
export function getCurrentEnvironmentConfig() {
  return environmentConfig[config.nodeEnv];
}
