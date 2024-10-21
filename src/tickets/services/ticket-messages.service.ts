/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TicketMessage } from '../entities/ticket-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { CreateTicketMessageDto } from '../dtos/create-ticket-message.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { TicketsService } from './tickets.service';

@Injectable()
export class TicketMessagesService {
  constructor(
    @InjectRepository(TicketMessage) private repo: Repository<TicketMessage>,
    private usersService: UsersService,
    @Inject(forwardRef(() => TicketsService))
    private ticketsService: TicketsService,
  ) {}
  async createTicketMessage(messageData: CreateTicketMessageDto, userId: number, applicationId: number) {
    if (!userId || !applicationId) {
      return null;
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const ticket = await this.ticketsService.findOneByApplication(messageData.ticketId, applicationId);
    if (!ticket) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET);
    }

    const preMessage = new TicketMessage();

    preMessage.ticket = ticket;
    preMessage.message = messageData.message;
    preMessage.createdBy = user;

    const message = this.repo.create({ ...preMessage });

    return this.repo.save(message);
  }

  findAllByTicket(ticketId: number) {
    if (!ticketId) {
      return null;
    }
    const messages = this.repo.find({
      where: { ticket: { id: ticketId } },
      relations: { ticket: true, createdBy: true },
    });
    if (!messages) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET_MESSAGE);
    }
    return messages;
  }

  async findOneByTicket(id: number, ticketId: number) {
    if (!id || !ticketId) {
      return null;
    }
    const message = await this.repo.findOne({
      where: { id, ticket: { id: ticketId } },
      relations: { ticket: true, createdBy: true },
    });
    if (!message) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET_MESSAGE);
    }
    return message;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const message = this.repo.findOneBy({ id });
    return message;
  }

  async update(id: number, ticketId: number, attrs: Partial<TicketMessage>) {
    const message = await this.findOneByTicket(id, ticketId);
    Object.assign(message, attrs);
    return this.repo.save(message);
  }

  async remove(id: number, ticketId: number) {
    if (!id || !ticketId) {
      return null;
    }
    const message = await this.findOneByTicket(id, ticketId);
    if (!message) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET_MESSAGE);
    }
    return this.repo.remove(message);
  }

  async removeAllByTicket(ticketId: number) {
    if (!ticketId) {
      return null;
    }
    return this.repo.delete({ ticket: { id: ticketId } });
  }
}
