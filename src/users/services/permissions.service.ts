/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MSG_EXCEPTION } from 'src/common/constants/messages';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private repo: Repository<Permission>) {}

  create(permissionDto) {
    const permission = this.repo.create(permissionDto);
    return this.repo.save(permission);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const permission = this.repo.findOneBy({ id });
    return permission;
  }

  findByName(name: string) {
    return this.repo.find({ where: { name } });
  }

  findBySlug(slug: string) {
    return this.repo.find({ where: { slug } });
  }

  findAll() {
    return this.repo.find();
  }

  findByUser(userId: number) {
    return this.repo.find({ where: { users: { id: userId } } });
  }

  async remove(id: number) {
    const permission = await this.findOne(id);
    if (!permission) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
    }
    return this.repo.remove(permission);
  }
}
