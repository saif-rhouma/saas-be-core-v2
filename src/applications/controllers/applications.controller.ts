/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateApplicationDto } from '../dtos/create-application.dto';
import { ApplicationsService } from '../services/applications.service';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { ApplicationDto } from '../dtos/application.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import getApplicationId from 'src/common/helpers/application-id.func';
import { UpdateApplicationDto } from '../dtos/update-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Serialize(ApplicationDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() applicationData: CreateApplicationDto, @GetUser() user: Partial<User>) {
    return this.applicationsService.createApplication(applicationData, user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findMyApp(@GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id'] || user.applications['id']);
    const application = await this.applicationsService.findOne(appId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    return application;
  }

  @Get('/:id')
  async findApplication(@Param('id') id: string) {
    const application = await this.applicationsService.findOne(parseInt(id));
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    return application;
  }

  @UseGuards(AuthenticationGuard)
  @Patch()
  async updateApplication(@Body() appData: UpdateApplicationDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const application = await this.applicationsService.update(appId, appData);
    return application;
  }

  @UseGuards(AuthenticationGuard)
  @Delete()
  removeMyApplication(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.applicationsService.remove(appId);
  }

  @Delete('/:id')
  removeApplication(@Param('id') id: string) {
    return this.applicationsService.remove(parseInt(id));
  }
}
