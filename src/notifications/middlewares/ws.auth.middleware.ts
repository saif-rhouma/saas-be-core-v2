/* eslint-disable prettier/prettier */
import { Socket } from 'socket.io';
import { WebSocketGuard } from 'src/common/guards/websocket.guard';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
  return (client, next) => {
    try {
      WebSocketGuard.validateToken(client);
      next();
    } catch (error) {
      next(error);
    }
  };
};
