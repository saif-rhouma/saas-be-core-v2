/* eslint-disable prettier/prettier */
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from 'src/common/constants/notification';
import { NotificationsGateway } from 'src/notifications/gateway/notifications.gateway';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { deleteKeysFromObj } from 'src/common/helpers/delete-keys-obj';

export class TicketsEvents {
  constructor(
    private readonly notificationGateway: NotificationsGateway,
    @InjectRepository(Ticket)
    private repo: Repository<Ticket>,
  ) {}

  @OnEvent('ticket-history')
  async handleTicketEvent(appId: number, userId: number) {
    const tickets = await this.repo.find({
      where: { application: { id: appId }, member: { id: userId }, status: TicketStatus.Open },
      relations: { member: true, messages: true, createdBy: true },
    });

    if (tickets.length > 0) {
      tickets.forEach((_item, idx) => {
        deleteKeysFromObj(tickets[idx], [
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
      });

      this.notificationGateway.handleNotificationMessage(userId.toString(), {
        message: `Open Ticket(s)`,
        type: NotificationType.HISTORY,
        data: tickets,
      });
    }
  }
}
