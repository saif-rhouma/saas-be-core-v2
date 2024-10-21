/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const ROLES_DECO_KEY = 'roles';
export const Roles = (roles: string[]) => {
  const res = SetMetadata(ROLES_DECO_KEY, roles);
  return res;
};
