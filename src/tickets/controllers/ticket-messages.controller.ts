/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';
import { TicketMessagesService } from '../services/ticket-messages.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreateTicketMessageDto } from '../dtos/create-ticket-message.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateTicketMessageDto } from '../dtos/update-ticket-message.dto';
import { TicketMessageDto } from '../dtos/ticket-message.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('ticket-messages')
export class TicketMessagesController {
  constructor(private ticketMessagesService: TicketMessagesService) {}

  @Serialize(TicketMessageDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() messageData: CreateTicketMessageDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.ticketMessagesService.createTicketMessage(messageData, user.id, appId);
  }

  // @Serialize(TicketMessageDto)
  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findAll(@Param('id') id: string) {
    const messages = await this.ticketMessagesService.findAllByTicket(parseInt(id));
    if (!messages) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET_MESSAGE);
    }
    return messages;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateTicket(@Param('id') ticketId: string, @Body() messageData: UpdateTicketMessageDto) {
    const ticket = await this.ticketMessagesService.update(messageData.id, parseInt(ticketId), messageData);
    return ticket;
  }

  //   @UseGuards(AuthenticationGuard)
  //   @Delete('/:id')
  //   removeTicket(@Param('id') id: string, @GetUser() user: Partial<User>) {
  //     const appId = getApplicationId(user);
  //     return this.ticketsService.remove(parseInt(id), appId);
  //   }
}
