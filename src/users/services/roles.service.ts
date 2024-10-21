/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  create(roleData: CreateRoleDto) {
    const role = this.repo.create(roleData);
    return this.repo.save(role);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const role = this.repo.findOneBy({ id });
    return role;
  }

  findByName(name: string) {
    return this.repo.find({ where: { name } });
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ROLE);
    }
    return this.repo.remove(role);
  }
}
