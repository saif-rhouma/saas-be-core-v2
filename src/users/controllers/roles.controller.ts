/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post('/create')
  async createRole(@Body() roleData: CreateRoleDto) {
    return this.rolesService.create(roleData);
  }

  @Delete('/:id')
  async removeRole(@Param('id') id: string) {
    return this.rolesService.remove(parseInt(id));
  }

  @Get('/:id')
  async findRole(@Param('id') id: string) {
    const role = await this.rolesService.findOne(parseInt(id));
    if (!role) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ROLE);
    }
    return role;
  }
}
