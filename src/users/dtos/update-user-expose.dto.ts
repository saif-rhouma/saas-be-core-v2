/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
export class UpdateUserExposeDto {
  @Expose()
  email: string;

  @Expose()
  lastName: string;

  @Expose()
  firstName: string;

  @Expose()
  avatar: string;

  @Expose()
  phoneNumber: string;
}
