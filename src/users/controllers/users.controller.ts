/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { PermissionType } from 'src/common/constants/permissions';
import { RoleType } from 'src/common/constants/roles';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import getApplicationId from 'src/common/helpers/application-id.func';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CreateUserAccountDto } from '../dtos/create-user-account.dto';
import { UpdateStaffDto } from '../dtos/update-staff.dto';
import { UpdateUserExposeDto } from '../dtos/update-user-expose.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpgradeUserDto } from '../dtos/upgrade-user.dto';
import { AccountType, User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { CreateStaffDto } from 'src/auth/dtos/create-staff.dto';
import { StaffDto } from '../dtos/staff.dto';
import { StaffListDto } from '../dtos/staff-list.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize(CreateUserAccountDto)
  // @UseGuards(AuthenticationGuard)
  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    const users = await this.usersService.find(userData.email);
    if (users.length) {
      // throw Exception !!!
      throw new BadRequestException(MSG_EXCEPTION.OTHER_ALREADY_IN_USE_EMAIL);
    }
    const user = await this.usersService.createUser(userData);
    return user;
  }

  @Serialize(UpdateUserExposeDto)
  @UseGuards(AuthenticationGuard)
  @Patch()
  async updateUserSelfAccount(@Body() userData: UpdateUserDto, @GetUser() user: Partial<User>) {
    const res = await this.usersService.update(user.id, userData);
    return res;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('staff/:id')
  async updateStaffAccount(@Param('id') id: string, @Body() userData: UpdateStaffDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const res = await this.usersService.updateStaff(parseInt(id), appId, userData);
    return res;
  }

  @Roles([RoleType.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('upgrade/:id')
  async upgradeUser(@Param('id') id: string, @Body() { accountType }: UpgradeUserDto) {
    const user = await this.usersService.upgradeUser(parseInt(id), accountType as AccountType);
    return user;
  }

  @Serialize(CreateUserAccountDto)
  @UseGuards(AuthenticationGuard)
  @Post('staff')
  async createStaff(@Body() userData: CreateStaffDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const staff = await this.usersService.createStaff(userData, appId);
    return staff;
  }

  @Serialize(StaffDto)
  @UseGuards(AuthenticationGuard)
  @Delete('/staff/:id')
  removeStaff(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.usersService.removeStaff(parseInt(id), appId);
  }

  @Serialize(StaffListDto)
  @UseGuards(AuthenticationGuard)
  @Get('staff')
  async findAllStaff(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const staffs = await this.usersService.findAllStaffByApplication(appId);
    return staffs;
  }

  @Serialize(StaffDto)
  @UseGuards(AuthenticationGuard)
  @Get('/staff/:id')
  async findStaff(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const staff = await this.usersService.findOneByApplication(parseInt(id), appId);
    if (!staff) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER_STAFF);
    }
    return staff;
  }

  //! Protected Route By Authentication [WILL BE DELETED]
  @UseGuards(AuthenticationGuard)
  @Get('auth')
  async authProtected() {
    return 'Hello There!!!';
  }

  //! Protected Route By Role [WILL BE DELETED]
  @Roles([RoleType.ADMIN, RoleType.STAFF])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('role')
  async roleProtected() {
    return 'Hello There!!!';
  }

  //! Protected Route By Permission [WILL BE DELETED]
  @Permissions([PermissionType.PRINT_ORDER])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('permission')
  async permissionProtected() {
    return 'Hello There!!!';
  }

  // @Serialize(StaffDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  //! Protected Route By Role [WILL BE DELETED / OR UPDATED]
  // @Roles([RoleType.ADMIN, RoleType.USER])
  @UseGuards(AuthenticationGuard)
  @Post('assign')
  async assignPermissions(@GetUser() user: Partial<User>, @Body() body: any) {
    const { permission } = body;
    await this.usersService.assignPermission(user.id, permission);
    return 'Hello There!!!';
  }
}
