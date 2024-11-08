/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_PERMISSIONS_SWITCHER_PARAMS_DECO_KEY } from '../decorators/permission-switcher-params.decorator';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthorizationSwitcher implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { user } = request;

    const { authorizes, callback } =
      this.reflector.get<{ authorizes: string[]; callback?: (user: any) => void }>(
        ROLES_PERMISSIONS_SWITCHER_PARAMS_DECO_KEY,
        context.getHandler(),
      ) || {};

    if (!authorizes) {
      return true; // No permissions required
    }

    const permissions = (await this.usersService.getDetails(user.id)).permissions;

    const hasPermission = permissions
      .map((permission) => permission.slug)
      .some((permission) => authorizes.includes(permission));

    if (hasPermission && callback) {
      const callbackResponse = await callback(user);
      response.json(callbackResponse);
      return false;
    }

    //! IF WE ADDED A NEW DECORATOR DOR ROLE SWITCHER JUST UNCOMMENT THIS PART
    // const roles = (await this.usersService.getDetails(user.id)).roles;
    // const hasRole = roles.map((role) => role.name).some((role) => authorizes.includes(role));

    // if (hasRole && callback) {
    //   callback();
    //   return false;
    // }

    return true;
  }
}
