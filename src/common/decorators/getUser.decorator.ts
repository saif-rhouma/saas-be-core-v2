/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): Partial<User> => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
