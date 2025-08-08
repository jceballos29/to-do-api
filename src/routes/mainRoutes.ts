// ========================================
// RUTAS PRINCIPALES - TYPESCRIPT
// ========================================
// Configuración de rutas para endpoints generales

import { Router } from 'express';
import { mainController } from '@/controllers/mainController';
import { taskRoutes } from './taskRoutes';

/**
 * Router para rutas principales
 */
const router: Router = Router();

/**
 * GET / - Información general de la API
 */
router.get('/', mainController.getApiInfo.bind(mainController));

/**
 * GET /health - Health check del servidor
 */
router.get('/health', mainController.getHealthCheck.bind(mainController));

/**
 * GET /version - Comparación entre versiones
 */
router.get('/version', mainController.getVersionComparison.bind(mainController));

/**
 * /api/tasks - Rutas de tareas
 */
router.use('/api/tasks', taskRoutes);

export { router as mainRoutes };
