import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import { config } from '@/config';
import { logger } from '@/utils/logger.service';

/**
 * Servicio de Sockets para manejar la lógica de comunicación en tiempo real.
 * Encapsula la configuración y los eventos de Socket.IO.
 */
export class SocketService {
  private io: SocketIOServer;

  constructor(httpServer: http.Server) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.initializeHandlers();
  }

  /**
   * Inicializa los manejadores de eventos para las conexiones de sockets.
   */
  private initializeHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`⚡ Nuevo cliente conectado: ${socket.id}`);
      this.registerSocketEvents(socket);
    });
  }

  /**
   * Registra los eventos específicos que escuchará cada socket.
   */
  private registerSocketEvents(socket: Socket): void {
    // Evento para cuando una tarea es creada
    socket.on('task_created', (taskData: any) => {
      logger.info('📝 Tarea creada, emitiendo a todos los clientes');
      // Emitir el evento a todos los clientes, incluyendo el remitente
      this.io.emit('new_task_alert', taskData);
    });

    socket.on('disconnect', () => {
      logger.info('🔌 Cliente desconectado');
    });
  }

  /**
   * Método para obtener la instancia de Socket.IO si es necesario.
   * @returns La instancia del servidor Socket.IO.
   */
  public getIO(): SocketIOServer {
    return this.io;
  }
}