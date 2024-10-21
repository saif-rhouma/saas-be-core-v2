/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { User } from '../entities/user.entity';
import { PermissionsService } from '../services/permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Post('/create')
  async createPermission(@Body() permissionData: CreatePermissionDto) {
    return this.permissionsService.create(permissionData);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/user')
  async findUserPermissions(@GetUser() user: Partial<User>) {
    const userId = user.id;
    const permissions = await this.permissionsService.findByUser(userId);
    if (!permissions) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
    }
    return permissions;
  }

  @Get('/')
  async findAllPermissions() {
    const permissions = await this.permissionsService.findAll();
    if (!permissions) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
    }
    return permissions;
  }

  @Delete('/:id')
  async removePermission(@Param('id') id: string) {
    return this.permissionsService.remove(parseInt(id));
  }

  @Get('/:id')
  async findPermission(@Param('id') id: string) {
    const permission = await this.permissionsService.findOne(parseInt(id));
    if (!permission) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
    }
    return permission;
  }
}
