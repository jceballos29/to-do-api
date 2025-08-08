// // ========================================
// // APLICACIÓN PRINCIPAL - TYPESCRIPT PROFESSIONAL
// // ========================================
// // Servidor Express con TypeScript, PostgreSQL y Prisma

// import express, { Application, Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { config, validateConfig, getCurrentEnvironmentConfig } from '@/config';
// import { configureExpress5, express5Middleware } from '@/config/express5';
// import { mainRoutes } from '@/routes/mainRoutes';

// /**
//  * Clase principal de la aplicación
//  */
// class App {
//   public app: Application;
//   private readonly config = config;

//   constructor() {
//     this.app = express();
//     this.initializeExpress5Config();
//     this.initializeConfiguration();
//     this.initializeMiddleware();
//     this.initializeRoutes();
//     this.initializeErrorHandling();
//   }

//   /**
//    * Configura Express 5.x específicamente
//    */
//   private initializeExpress5Config(): void {
//     configureExpress5(this.app);
//     this.app.use(express5Middleware());
//   }

//   /**
//    * Inicializa y valida la configuración
//    */
//   private initializeConfiguration(): void {
//     try {
//       validateConfig();
//       console.log('🔧 Configuración inicial completada');
//     } catch (error) {
//       console.error('❌ Error en configuración:', error);
//       process.exit(1);
//     }
//   }

//   /**
//    * Configura middleware de seguridad y utilidades
//    */
//   private initializeMiddleware(): void {
//     const envConfig = getCurrentEnvironmentConfig();

//     // Middleware de seguridad
//     this.app.use(helmet({
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'"],
//           styleSrc: ["'self'", "'unsafe-inline'"],
//           scriptSrc: ["'self'"],
//           imgSrc: ["'self'", "data:", "https:"],
//         },
//       },
//     }));

//     // CORS
//     if (envConfig.enableCors) {
//       this.app.use(cors({
//         origin: this.config.corsOrigin,
//         credentials: true,
//         methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//         allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//       }));
//     }

//     // Logging de requests
//     if (envConfig.enableRequestLogging) {
//       this.app.use(morgan('combined'));
//     }

//     // Parseo de JSON y URL encoded - compatibilidad Express 5.x
//     this.app.use(express.json({ limit: '10mb',strict: true, type: 'application/json'}));

//     this.app.use(express.urlencoded({ extended: true, limit: '10mb', type: 'application/x-www-form-urlencoded'}));

//     // Headers personalizados - Express 5.x
//     this.app.use((_req: Request, res: Response, next: NextFunction) => {
//       res.header('X-API-Version', this.config.apiVersion);
//       res.header('X-API-Architecture', 'TypeScript + PostgreSQL + Prisma + Express5');
//       res.header('X-Powered-By', 'TODO API Professional v3.0');
//       res.header('X-Express-Version', '5.1.0');
//       next();
//     });

//     console.log('🛡️ Middleware de seguridad configurado');
//   }

//   /**
//    * Configura todas las rutas de la aplicación
//    */
//   private initializeRoutes(): void {
//     // Rutas principales
//     this.app.use('/', mainRoutes);

//     // Ruta para endpoints no encontrados - Express 5.x compatible
//     this.app.use((req: Request, res: Response) => {
//       res.status(404).json({
//         success: false,
//         message: 'Endpoint no encontrado',
//         requestedEndpoint: {
//           method: req.method,
//           path: req.originalUrl
//         },
//         availableEndpoints: {
//           'GET /': 'Información de la API',
//           'GET /health': 'Health check del servidor',
//           'GET /version': 'Comparación de versiones',
//           'GET /api/tasks': 'Lista de tareas',
//           'POST /api/tasks': 'Crear tarea',
//           'GET /api/tasks/stats': 'Estadísticas de tareas',
//           'GET /api/tasks/:id': 'Obtener tarea por ID',
//           'PUT /api/tasks/:id': 'Actualizar tarea',
//           'PATCH /api/tasks/:id/status': 'Actualizar estado de tarea',
//           'DELETE /api/tasks/:id': 'Eliminar tarea'
//         },
//         suggestions: [
//           'Verifica que la URL esté correcta',
//           'Revisa que el método HTTP sea el correcto',
//           'Consulta GET / para ver todos los endpoints disponibles'
//         ],
//         timestamp: new Date().toISOString()
//       });
//     });

//     console.log('🛣️ Rutas configuradas');
//   }

//   /**
//    * Configura manejo global de errores compatible con Express 5.x
//    */
//   private initializeErrorHandling(): void {
//     // Manejo de errores de aplicación - Express 5.x compatible
//     this.app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
//       console.error('💥 Error no manejado:', error);

//       if (res.headersSent) {
//         return next(error);
//       }

//       const envConfig = getCurrentEnvironmentConfig();
//       const statusCode = error.statusCode || error.status || 500;

//       const errorResponse: any = {
//         success: false,
//         message: error.message || 'Error interno del servidor',
//         code: error.code || 'INTERNAL_SERVER_ERROR',
//         timestamp: new Date().toISOString(),
//         express_version: '5.1.0'
//       };

//       // En desarrollo, incluir stack trace
//       if (envConfig.enableDetailedErrors) {
//         errorResponse.stack = error.stack;
//         errorResponse.details = error.details;
//       }

//       res.status(statusCode).json(errorResponse);
//     });

//     console.log('🚨 Manejo de errores configurado para Express 5.x');
//   }

//   /**
//    * Inicia el servidor HTTP
//    */
//   public listen(): void {
//     const server = this.app.listen(this.config.port, () => {
//       console.log('=========================================');
//       console.log('🚀 TODO API Professional v3.0 + Express 5.x');
//       console.log('=========================================');
//       console.log(`🌐 Servidor: http://localhost:${this.config.port}`);
//       console.log(`🏗️ Arquitectura: TypeScript + PostgreSQL + Prisma + Express 5.1.0`);
//       console.log(`🔧 Entorno: ${this.config.nodeEnv}`);
//       console.log(`📊 Versión API: ${this.config.apiVersion}`);
//       console.log(`⚡ Express: 5.1.0 (Última versión)`);
//       console.log('');
//       console.log('📋 Endpoints disponibles:');
//       console.log(`   GET    http://localhost:${this.config.port}/`);
//       console.log(`   GET    http://localhost:${this.config.port}/health`);
//       console.log(`   GET    http://localhost:${this.config.port}/version`);
//       console.log(`   GET    http://localhost:${this.config.port}/api/tasks`);
//       console.log(`   POST   http://localhost:${this.config.port}/api/tasks`);
//       console.log(`   GET    http://localhost:${this.config.port}/api/tasks/stats`);
//       console.log('=========================================');
//       console.log('💡 Próximos pasos:');
//       console.log('   1. Configurar PostgreSQL');
//       console.log('   2. Ejecutar: npm run prisma:migrate');
//       console.log('   3. Ver: npm run prisma:studio');
//       console.log('=========================================');
//     });

//     // Manejo graceful de cierre
//     process.on('SIGTERM', () => {
//       console.log('🔄 Recibida señal SIGTERM...');
//       server.close(() => {
//         console.log('✅ Servidor cerrado correctamente');
//         process.exit(0);
//       });
//     });

//     process.on('SIGINT', () => {
//       console.log('🔄 Recibida señal SIGINT (Ctrl+C)...');
//       server.close(() => {
//         console.log('✅ Servidor cerrado correctamente');
//         process.exit(0);
//       });
//     });
//   }
// }

// // Manejo de errores globales no capturados
// process.on('uncaughtException', (error: Error) => {
//   console.error('💥 Excepción no capturada:', error);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
//   console.error('💥 Promesa rechazada no manejada:', { reason, promise });
//   process.exit(1);
// });

// // Crear e iniciar la aplicación
// const app = new App();
// app.listen();

// // Exportar para testing
// export default app.app;
import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config, getCurrentEnvironmentConfig } from '@/config'
import { logger } from '@/utils/logger.service';
import mainRouter from './modules/main/main.router'

export class App {

  public app: Application;
  private readonly config = config;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandler();
  }

  /**
   * Configuración de la aplicación
   */
  private middlewares(): void {

    const envConfig = getCurrentEnvironmentConfig();

    this.app.use(helmet());
    this.app.use(express.json({ limit: '10mb', strict: true, type: 'application/json' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb', type: 'application/x-www-form-urlencoded' }));
    if (envConfig.enableCors) {
      this.app.use(cors({
        origin: this.config.corsOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      }));
    }
    if (envConfig.enableRequestLogging) {
      this.app.use(morgan('dev', {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      }));
    }
    this.app.use((_req: Request, res: Response, next: NextFunction) => {
      res.header('X-API-Version', this.config.apiVersion);
      res.header('X-API-Architecture', 'TypeScript + PostgreSQL + Prisma + Express5');
      res.header('X-Powered-By', 'TODO API Professional v3.0');
      next();
    });

    logger.info('MIDDLEWARE: configured');
  }

  private routes(): void {

    this.app.use('/', mainRouter);

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        requestedEndpoint: {
          method: req.method,
          path: req.originalUrl
        },
        timestamp: new Date().toISOString()
      });
    });

    logger.info('ROUTES: configured');
  }

  private errorHandler(): void {
    this.app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
      logger.error(error, '💥 Error no manejado:');

      if (res.headersSent) {
        return next(error);
      }

      const envConfig = getCurrentEnvironmentConfig();
      const statusCode = error.statusCode || error.status || 500;

      const errorResponse: any = {
        success: false,
        message: error.message || 'Error interno del servidor',
        code: error.code || 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
        express_version: '5.1.0'
      };

      // En desarrollo, incluir stack trace
      if (envConfig.enableDetailedErrors) {
        errorResponse.stack = error.stack;
        errorResponse.details = error.details;
      }

      res.status(statusCode).json(errorResponse);
    });

    logger.info('ERROR HANDLER: configured');
  }

  public getApp(): Application {
    return this.app;
  }

}