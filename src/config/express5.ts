// ========================================
// CONFIGURACIÓN ESPECÍFICA PARA EXPRESS 5.x
// ========================================
// Configuraciones y helpers específicos para Express 5.1.0

import { Application } from 'express';

/**
 * Configuraciones específicas para Express 5.x
 */
export const express5Config = {
  // Opciones de path-to-regexp compatibles
  routerOptions: {
    caseSensitive: false,
    mergeParams: false,
    strict: false
  },
  
  // Configuración de trust proxy para Express 5.x
  trustProxy: {
    enabled: true,
    value: 1
  },
  
  // Configuración de query parser
  queryParser: {
    extended: true
  }
} as const;

/**
 * Aplica configuraciones específicas de Express 5.x
 */
export function configureExpress5(app: Application): void {
  // Configurar trust proxy
  if (express5Config.trustProxy.enabled) {
    app.set('trust proxy', express5Config.trustProxy.value);
  }
  
  // Configurar query parser
  app.set('query parser', express5Config.queryParser.extended ? 'extended' : 'simple');
  
  // Configurar case sensitivity
  app.set('case sensitive routing', express5Config.routerOptions.caseSensitive);
  
  // Configurar strict routing
  app.set('strict routing', express5Config.routerOptions.strict);
  
  // Desactivar X-Powered-By por defecto
  app.disable('x-powered-by');
  
  console.log('✅ Configuraciones específicas de Express 5.x aplicadas');
}

/**
 * Middleware específico para Express 5.x
 */
export function express5Middleware() {
  return (req: any, res: any, next: any) => {
    // Agregar información de Express 5.x al request
    req.expressVersion = '5.1.0';
    
    // Headers específicos de Express 5.x
    res.set({
      'X-Express-Version': '5.1.0',
      'X-Node-Version': process.version,
      'X-API-Compatibility': 'Express5'
    });
    
    next();
  };
}

/**
 * Validador de rutas compatible con Express 5.x
 */
export function validateRoute(path: string): boolean {
  try {
    // Verificar que la ruta no tenga caracteres problemáticos para path-to-regexp v8+
    const problematicChars = /[{}]/;
    if (problematicChars.test(path)) {
      console.warn(`⚠️ Ruta potencialmente problemática para Express 5.x: ${path}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error validando ruta ${path}:`, error);
    return false;
  }
}

/**
 * Helper para crear rutas compatibles con Express 5.x
 */
export function createCompatibleRoute(path: string): string {
  // Reemplazar patrones problemáticos
  return path
    .replace(/\{(\w+)\}/g, ':$1') // {id} -> :id
    .replace(/\*\*/g, '*'); // ** -> *
}
