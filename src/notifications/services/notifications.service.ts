/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
@Injectable()
export class NotificationsService {
  // Store active clients with their clientId
  // private clients: { [clientId: string]: Subject<MessageEvent> } = {};

  private clients: Map<string, string> = new Map();

  addClient(clientId: string, socketId: string) {
    this.clients.set(clientId, socketId);
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
  }

  getClient(clientId: string) {
    return this.clients.get(clientId);
  }
}
