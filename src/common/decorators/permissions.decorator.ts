/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_DECO_KEY = 'permissions';
export const Permissions = (permissions: string[]) => SetMetadata(PERMISSION_DECO_KEY, permissions);
