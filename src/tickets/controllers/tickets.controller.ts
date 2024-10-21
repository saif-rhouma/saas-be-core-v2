/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateTicketDto } from '../dtos/update-ticket.dto';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  //   @Serialize(PlanDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() ticketData: CreateTicketDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.ticketsService.createTicket(ticketData, appId, user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/analytics')
  async ordersAnalytics(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const analytics = await this.ticketsService.analytics(appId);
    return analytics;
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const tickets = await this.ticketsService.findAllByApplicationAndUser(user.id, appId);
    // const tickets = await this.ticketsService.findAllByApplication(appId);
    if (!tickets) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_TICKET);
    }
    return tickets;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findTicket(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const ticket = await this.ticketsService.findOneByApplication(parseInt(id), appId);
    return ticket;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateTicket(@Param('id') id: string, @Body() ticketData: UpdateTicketDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const ticket = await this.ticketsService.update(parseInt(id), appId, ticketData);
    return ticket;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeTicket(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.ticketsService.remove(parseInt(id), appId);
  }
}
