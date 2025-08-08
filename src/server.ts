import { App } from './app';
import { connectDatabase, disconnectDatabase } from './utils/prisma.client';
import { config } from './config';
import http from 'http';
import { SocketService } from './sockets'; // Importamos la nueva clase
import { logger } from '@/utils/logger.service';

async function startServer(): Promise<void> {

  logger.info('=========================================');
  logger.info('Task Tracker API');
  logger.info('=========================================');
  logger.info('=========================================');
  logger.info(`SERVER: http://localhost:${config.port}`);
  logger.info('ARCHITECTURE: TypeScript + PostgreSQL + Prisma + Express');
  logger.info(`ENVIRONMENT: ${config.nodeEnv}`);
  logger.info(`API VERSION: ${config.apiVersion}`);
  logger.info('=========================================');

  const app = new App();
  const express = app.getApp();

  const server = http.createServer(express);

  try {
    await connectDatabase();
    logger.info('=========================================');

    new SocketService(server);

    server.listen(config.port, () => {
      logger.info('Server ready and listening');
      logger.info('=========================================');
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal} signal. Shutting down server...`);

      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server closed successfully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error(error, 'Error starting application:');
    if (error instanceof Error) {
      logger.error(`Error details: ${error.message}`);
    }
    await disconnectDatabase();
    process.exit(1);
  }
}

startServer();