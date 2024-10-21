/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
export class StaffListDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  lastName: string;

  @Expose()
  firstName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  isActive: boolean;
}
