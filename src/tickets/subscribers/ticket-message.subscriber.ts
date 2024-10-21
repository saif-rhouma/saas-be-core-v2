/* eslint-disable prettier/prettier */
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { TicketMessage } from '../entities/ticket-message.entity';
import { NotificationsGateway } from 'src/notifications/gateway/notifications.gateway';
import { Inject } from '@nestjs/common';
import { NotificationType } from 'src/common/constants/notification';

@EventSubscriber()
export class TicketMessageSubscriber implements EntitySubscriberInterface<TicketMessage> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly notificationGateway: NotificationsGateway,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return TicketMessage;
  }

  /**
   * Called after entity insert.
   */
  afterInsert(event: InsertEvent<TicketMessage>) {
    this.handleTicketCreation(event.entity);
  }

  async handleTicketCreation(ticketMessage: TicketMessage) {
    const member = ticketMessage.ticket.member.id;
    const owner = ticketMessage.ticket.createdBy.id;

    const clientId = owner === ticketMessage.createdBy.id ? member : owner;

    const payload = { message: 'New Message', type: NotificationType.MESSAGE, data: ticketMessage };

    this.notificationGateway.handleNotificationMessage(clientId.toString(), payload);
  }
}
