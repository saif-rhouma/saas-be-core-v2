/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PermissionsGroupService } from '../services/permissions-group.service';
import { CreatePermissionsGroupDto } from '../dtos/create-permissions-group.dto';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from '../entities/user.entity';
import getApplicationId from 'src/common/helpers/application-id.func';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdatePermissionsGroupDto } from '../dtos/update-permissions-group.dto';
import { UsersService } from '../services/users.service';

@Controller('permissions-group')
export class PermissionsGroupController {
  constructor(
    private permissionsGroupService: PermissionsGroupService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createPermissionsGroup(@Body() pgData: CreatePermissionsGroupDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.permissionsGroupService.create(pgData, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/')
  async findAllPermissionsGroup(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const pgs = await this.permissionsGroupService.findAllByApplication(appId);
    if (!pgs) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION_GROUP);
    }
    return pgs;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/user/:id')
  async deleteUserFromPermissionsGroup(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const group = await this.usersService.getUserPermissionsGroup(parseInt(id), appId);
    await this.usersService.removeAllPermissionAndPG(parseInt(id), appId);
    return this.permissionsGroupService.findOneByApplication(group.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  async removePermissionsGroup(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.permissionsGroupService.remove(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findPermissionsGroup(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const pg = await this.permissionsGroupService.findOneByApplication(parseInt(id), appId);
    if (!pg) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION_GROUP);
    }
    return pg;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updatePermissionsGroup(
    @Param('id') id: string,
    @Body() pgData: UpdatePermissionsGroupDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    const pg = await this.permissionsGroupService.update(parseInt(id), appId, pgData);
    return pg;
  }
}
