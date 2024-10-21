/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_DECO_KEY } from '../decorators/roles.decorator';
import { PERMISSION_DECO_KEY } from '../decorators/permissions.decorator';
import { MSG_EXCEPTION } from '../constants/messages';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const requiredRoles = this.reflector.getAllAndMerge(ROLES_DECO_KEY, [context.getHandler(), context.getClass()]);
    if (requiredRoles.length) {
      const isFound = requiredRoles.some((ai) => user.roles.includes(ai));

      if (!isFound) {
        throw new UnauthorizedException(MSG_EXCEPTION.UNAUTHORIZED_ROLE);
      }
    }
    const requiredPermissions = this.reflector.getAllAndMerge(PERMISSION_DECO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredPermissions.length) {
      const hasPermission = await this.usersService.hasPermission(user.id, requiredPermissions);
      if (!hasPermission) {
        throw new UnauthorizedException(MSG_EXCEPTION.UNAUTHORIZED_PERMISSIONS);
      }
    }

    return true;
  }
}
