/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';

export class CustomerDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  ref: string;

  @Expose()
  isActive: boolean;

  @Expose()
  phoneNumber: string;

  @Expose()
  address: any;

  @Expose()
  taxNumber: string;

  @Expose()
  avatar: string;
}
