import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateReminderDto } from '../dtos/create-reminder.dto';
import { UpdateReminderDto } from '../dtos/update-reminder.dto';
import { RemindersService } from '../services/reminders.service';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('reminders')
export class RemindersController {
  constructor(private remindersService: RemindersService) {}

  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() reminderData: CreateReminderDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.remindersService.createReminder(reminderData, appId, user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.remindersService.findAllByApplication(appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findCustomer(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.remindersService.findOneByApplication(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateReminder(
    @Param('id') id: string,
    @Body() reminderData: UpdateReminderDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    const reminder = await this.remindersService.update(parseInt(id), appId, reminderData);
    return reminder;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeReminder(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.remindersService.remove(parseInt(id), appId);
  }
}
