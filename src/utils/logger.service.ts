import pino, { Logger, LoggerOptions } from 'pino';
import { config } from '@/config';

/**
 * Servicio de Logging para la aplicación.
 * Utiliza el patrón Singleton para asegurar una única instancia del logger.
 */
export class LoggerService {
  private static instance: Logger;

  /**
   * Las opciones de configuración de Pino.
   * Se ajustan según el entorno (desarrollo o producción).
   */
  private static getLoggerOptions(): LoggerOptions {
    const isDevelopment = config.nodeEnv === 'development';

    const options: LoggerOptions = {
      level: config.logLevel,
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      formatters: {
        level: (label) => ({ level: label }),
      },
    };

    if (isDevelopment) {
      options.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      };
    }

    return options;
  }

  /**
   * Obtiene la instancia singleton del logger.
   * @returns La instancia única de Pino Logger.
   */
  public static getInstance(): Logger {
    if (!LoggerService.instance) {
      const options = this.getLoggerOptions();
      LoggerService.instance = pino(options);
    }
    return LoggerService.instance;
  }
}

/**
 * Exporta el logger de forma directa para ser utilizado en cualquier parte de la aplicación.
 */
export const logger = LoggerService.getInstance();