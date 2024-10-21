/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from '../auth/entities/token.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { Application } from 'src/applications/entities/application.entity';
import { ApplicationsModule } from 'src/applications/applications.module';
import { PermissionsGroup } from './entities/permissions-group.entity';
import { PermissionsGroupService } from './services/permissions-group.service';
import { PermissionsGroupController } from './controllers/permissions-group.controller';

@Module({
  controllers: [UsersController, RolesController, PermissionsController, PermissionsGroupController],
  providers: [UsersService, RolesService, PermissionsService, PermissionsGroupService],
  imports: [
    forwardRef(() => ApplicationsModule),
    TypeOrmModule.forFeature([User, RefreshToken, Role, Permission, PermissionsGroup, Application]),
  ],
  exports: [UsersService, RolesService, PermissionsService],
})
export class UsersModule {}
