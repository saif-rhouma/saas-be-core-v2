/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { Repository } from 'typeorm';
import { PermissionsGroup } from '../entities/permissions-group.entity';
import { CreatePermissionsGroupDto } from '../dtos/create-permissions-group.dto';
import { PermissionsService } from './permissions.service';
import { UpdatePermissionsGroupDto } from '../dtos/update-permissions-group.dto';
import { UsersService } from './users.service';

@Injectable()
export class PermissionsGroupService {
  constructor(
    @InjectRepository(PermissionsGroup) private repo: Repository<PermissionsGroup>,
    @Inject(forwardRef(() => ApplicationsService))
    private applicationsService: ApplicationsService,
    private permissionsService: PermissionsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(pgData: CreatePermissionsGroupDto, applicationId: number) {
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    const [pgExist] = await this.repo.find({ where: { name: pgData.name } });
    if (pgExist) {
      throw new NotAcceptableException(MSG_EXCEPTION.OTHER_ALREADY_IN_PERMISSIONS_GROUP);
    }

    const pg = this.repo.create(pgData);

    for (const permissionSlug of pgData.permissionsList) {
      const [permission] = await this.permissionsService.findBySlug(permissionSlug);
      if (!permission) {
        throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
      }
      if (pg.permissions) {
        pg.permissions.push(permission);
      } else {
        pg.permissions = [permission];
      }
    }

    pg.application = application;
    return this.repo.save(pg);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const pg = this.repo.findOneBy({ id });
    return pg;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const pg = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: { application: true, permissions: true, staffs: true },
    });
    if (!pg) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION_GROUP);
    }
    return pg;
  }

  findByName(name: string, appId: number) {
    return this.repo.find({ where: { name, application: { id: appId } } });
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const pg = await this.findOneByApplication(id, appId);
    if (!pg) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION_GROUP);
    }
    return this.repo.remove(pg);
  }

  async findAllByApplication(appId: number) {
    const pgs = await this.repo.find({
      where: { application: { id: appId } },
      relations: { application: true, permissions: true, staffs: true },
    });
    return pgs;
  }

  async update(id: number, appId: number, attrs: UpdatePermissionsGroupDto) {
    const pg = await this.findOneByApplication(id, appId);
    if (!pg) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION_GROUP);
    }
    Object.assign(pg, attrs);

    pg.permissions = [];

    for (const permissionSlug of attrs.permissionsList) {
      const [permission] = await this.permissionsService.findBySlug(permissionSlug);
      if (!permission) {
        throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
      }
      pg.permissions.push(permission);
    }

    // ** Update Users Permissions Here!
    await this.usersService.updateStaffPermissionFromPG(pg);
    return this.repo.save(pg);
  }
}
