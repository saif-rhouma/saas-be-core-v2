/* eslint-disable prettier/prettier */
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationType } from 'src/common/constants/notification';
import { WebSocketGuard } from 'src/common/guards/websocket.guard';
import { SocketAuthMiddleware } from '../middlewares/ws.auth.middleware';
import { ServerToClientEvents } from '../types/server-to-client-events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import getApplicationId from 'src/common/helpers/application-id.func';

@WebSocketGateway({ namespace: 'api/notifications', cors: '*:*' })
@UseGuards(WebSocketGuard)
export class NotificationsGateway implements OnModuleInit {
  private clients: Map<string, string> = new Map();

  constructor(private eventEmitter: EventEmitter2) {}

  private addClient(clientId: string, socketId: string) {
    this.clients.set(clientId, socketId);
    console.log('---> Total Client Connected', this.clients.size);
  }

  private removeClient(clientId: string) {
    this.clients.delete(clientId);
    console.log('---> Total Client Connected', this.clients.size);
  }

  private getClient(clientId: string) {
    return this.clients.get(clientId);
  }

  @WebSocketServer() server: Server<any, ServerToClientEvents>;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
  }
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Socket ${socket.id} Connected For User : ${socket.data.user.id}`);
      const appId = getApplicationId(socket.data.user);
      const userId = socket.data.user.id;

      this.addClient(socket.data.user.id.toString(), socket.id.toString());
      this.eventEmitter.emit('ticket-history', appId, userId);
      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected!`);
        this.removeClient(socket.data.user.id.toString());
      });
    });
  }

  handleNotificationMessage(clientId: string, payload: { message: string; type: NotificationType; data: any }) {
    const socketId = this.getClient(clientId);
    if (socketId) {
      try {
        const recipientSocket = this.server.sockets['get'](socketId);
        if (recipientSocket) {
          recipientSocket.emit('newNotification', {
            type: payload.type,
            payload,
          });
        } else {
          console.log('Recipient not connected');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Recipient not connected');
    }
  }
}
