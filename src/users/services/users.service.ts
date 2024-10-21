/* eslint-disable prettier/prettier */
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountType, User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { PermissionsService } from './permissions.service';
import { hashPassword } from 'src/common/helpers/hash-password.func';
import { RoleType } from 'src/common/constants/roles';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { CreateStaffDto } from 'src/auth/dtos/create-staff.dto';
import { UpdateStaffDto } from '../dtos/update-staff.dto';
import { PermissionsGroupService } from './permissions-group.service';
import { PermissionsGroup } from '../entities/permissions-group.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    @Inject(forwardRef(() => ApplicationsService))
    private applicationsService: ApplicationsService,
    @Inject(forwardRef(() => PermissionsGroupService))
    private permissionsGroupService: PermissionsGroupService,
  ) {}

  createSimpleUser(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async createUser(userData: Partial<CreateUserDto>) {
    const user = this.repo.create({ ...userData });
    if (!userData.role) {
      userData['role'] = RoleType.USER;
    }
    if (userData['role']) {
      const [role] = await this.rolesService.findByName(userData['role']);
      if (user.roles) {
        user.roles.push(role);
      } else {
        user.roles = [role];
      }
    }
    return this.repo.save(user);
  }

  async createStaff(staffData: Partial<CreateStaffDto>, applicationId: number) {
    const users = await this.find(staffData.email);
    if (users.length) {
      // throw Exception !!!
      throw new BadRequestException(MSG_EXCEPTION.OTHER_ALREADY_IN_USE_EMAIL);
    }

    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    // Hash the users password
    const result = await hashPassword(staffData.password);
    delete staffData.password;

    staffData.password = result;

    const user = this.repo.create({ ...staffData });
    staffData['role'] = RoleType.STAFF;

    if (staffData['role']) {
      const [role] = await this.rolesService.findByName(staffData['role']);
      if (user.roles) {
        user.roles.push(role);
      } else {
        user.roles = [role];
      }
    }
    if (user.applications) {
      user.applications.push(application);
    } else {
      user.applications = [application];
    }

    if (staffData.permissions) {
      for (const permissionSlug of staffData.permissions) {
        const [permission] = await this.permissionsService.findBySlug(permissionSlug);
        if (!permission) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
        }
        if (user.permissions) {
          user.permissions.push(permission);
        } else {
          user.permissions = [permission];
        }
      }
    }
    if (staffData.permissionsGroup && staffData.permissionsGroup !== 0) {
      user.permissions = [];
      const permissionsGroup = await this.permissionsGroupService.findOneByApplication(
        staffData.permissionsGroup,
        applicationId,
      );

      user.groups = [permissionsGroup];

      for (const perm of permissionsGroup.permissions) {
        const permission = await this.permissionsService.findOne(perm.id);
        if (user.permissions) {
          user.permissions.push(permission);
        } else {
          user.permissions = [permission];
        }
      }
    } else {
      user.groups = [];
    }

    return this.repo.save(user);
  }

  async assignRole(userId: number, roleName: string) {
    if (!userId) {
      return null;
    }
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const [role] = await this.rolesService.findByName(roleName);
    if (!role) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ROLE);
    }
    if (user.roles) {
      user.roles.push(role);
    } else {
      user.roles = [role];
    }
    return this.repo.save(user);
  }

  async assignPermission(userId: number, permissionSlug: string) {
    if (!userId) {
      return null;
    }
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const [permission] = await this.permissionsService.findBySlug(permissionSlug);
    if (!permission) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
    }
    if (user.permissions) {
      user.permissions.push(permission);
    } else {
      user.permissions = [permission];
    }
    return this.repo.save(user);
  }

  async updateLastLogin(userId: number) {
    if (!userId) {
      return null;
    }
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    user.lastLogin = new Date();

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const user = this.repo.findOneBy({ id });
    return user;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const staff = await this.repo.findOne({
      where: { id, applications: { id: appId }, roles: { name: RoleType.STAFF } },
      relations: ['permissions', 'groups'],
    });
    if (!staff) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER_STAFF);
    }
    return staff;
  }

  async getUserPermissionsGroup(userId: number, appId: number) {
    const user = await this.findOneByApplication(userId, appId);
    if (user.groups) {
      return user.groups[0];
    }
    return null;
  }

  find(email: string) {
    return this.repo.find({ where: { email }, relations: { roles: true, userOwnedApps: true, applications: true } });
  }

  findAllStaffByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const users = this.repo.find({
      where: { applications: { id: appId }, roles: { name: RoleType.STAFF } },
      relations: { roles: true, userOwnedApps: true, applications: true },
    });
    if (!users) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER_STAFF);
    }
    return users;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    if (attrs.password) {
      const hashedPassword = await hashPassword(attrs.password);
      attrs.password = hashedPassword;
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async updateStaff(id: number, appId: number, attrs: Partial<UpdateStaffDto>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER_STAFF);
    }
    if (attrs.password) {
      const hashedPassword = await hashPassword(attrs.password);
      attrs.password = hashedPassword;
    }
    Object.assign(user, attrs);

    if (attrs.permissions) {
      user.permissions = [];
      for (const permissionSlug of attrs.permissions) {
        const [permission] = await this.permissionsService.findBySlug(permissionSlug);
        if (!permission) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
        }
        if (user.permissions) {
          user.permissions.push(permission);
        } else {
          user.permissions = [permission];
        }
      }
    }

    if (attrs.permissionsGroup && attrs.permissionsGroup !== 0) {
      user.permissions = [];
      const permissionsGroup = await this.permissionsGroupService.findOneByApplication(attrs.permissionsGroup, appId);

      user.groups = [permissionsGroup];

      for (const perm of permissionsGroup.permissions) {
        const permission = await this.permissionsService.findOne(perm.id);
        if (user.permissions) {
          user.permissions.push(permission);
        } else {
          user.permissions = [permission];
        }
      }
    } else {
      user.groups = [];
    }

    return this.repo.save(user);
  }

  async removeAllPermissionAndPG(userId: number, appId: number) {
    const user = await this.findOneByApplication(userId, appId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER_STAFF);
    }
    user.groups = [];
    user.permissions = [];
    return this.repo.save(user);
  }

  async updateStaffPermissionFromPG(pg: PermissionsGroup) {
    for (const staff of pg.staffs) {
      staff.permissions = [];
      for (const permission of pg.permissions) {
        if (staff.permissions) {
          staff.permissions.push(permission);
        } else {
          staff.permissions = [permission];
        }
      }
      await this.repo.save(staff);
    }
  }

  async upgradeUser(id: number, accountType: AccountType) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    user.accountType = accountType;
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }

  async removeStaff(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const staff = await this.findOneByApplication(id, appId);
    if (!staff) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER_STAFF);
    }
    return this.repo.remove(staff);
  }

  async hasPermission(id: number, slugs: string[]) {
    const [userWithPermission] = await this.repo
      .createQueryBuilder('user')
      .where('(user.id = :id) AND (permission.slug IN (:...slugs))', {
        id: id,
        slugs: slugs,
      })
      .leftJoinAndSelect('user.permissions', 'permission')
      .execute();

    return userWithPermission;
  }
}
