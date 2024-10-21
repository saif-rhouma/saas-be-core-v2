/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { NotificationType } from 'src/common/constants/notification';
import { NotificationsGateway } from 'src/notifications/gateway/notifications.gateway';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { deleteKeysFromObj } from 'src/common/helpers/delete-keys-obj';

@EventSubscriber()
export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly notificationGateway: NotificationsGateway,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Ticket;
  }

  /**
   * Called after entity insert.
   */
  afterInsert(event: InsertEvent<Ticket>) {
    // console.log(`A new ticket has been inserted: `, event.entity);
    this.handleTicketCreation(event.entity);
  }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<Ticket>) {
    if (event.entity.status === TicketStatus.Closed) {
      this.handleTicketClosed(event.entity);
    }
  }

  async handleTicketCreation(ticket: Ticket) {
    this.sendNotificationToClient(
      ticket.member.id.toString(),
      `Ticket: ${ticket.topic}`,
      NotificationType.TICKET,
      ticket,
    );
  }

  async handleTicketClosed(ticket) {
    this.sendNotificationToClient(
      ticket.member.id.toString(),
      `Ticket: ${ticket.topic}`,
      NotificationType.TICKET,
      ticket,
    );
  }

  // Function to send the notification to a specific client
  sendNotificationToClient(clientId: string, message: string, type: NotificationType, data: any) {
    const dataUpdated = deleteKeysFromObj(data, [
      ['createdBy', 'email'],
      ['createdBy', 'password'],
      ['createdBy', 'accountType'],
      ['createdBy', 'applicationThemeSetting'],
      ['createdBy', 'isActive'],
      ['member', 'email'],
      ['member', 'password'],
      ['member', 'accountType'],
      ['member', 'applicationThemeSetting'],
      ['member', 'isActive'],
    ]);
    this.notificationGateway.handleNotificationMessage(clientId, { message, type, data: dataUpdated });
  }
}
