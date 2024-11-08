/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const ROLES_PERMISSIONS_SWITCHER_PARAMS_DECO_KEY = 'roles-permissions-switcher-params';

export const PermissionsSwitcher = (authorizes: string[], callback?: (user: any) => void) =>
  SetMetadata(ROLES_PERMISSIONS_SWITCHER_PARAMS_DECO_KEY, { authorizes, callback });
