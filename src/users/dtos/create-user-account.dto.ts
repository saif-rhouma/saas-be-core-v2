/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class CreateUserAccountDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.roles.map((role) => role.name))
  roles: string[];

  @Expose()
  phoneNumber: string;

  @Expose()
  accountType: string;
}
