/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  isActive: boolean;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  address: any;

  @IsOptional()
  @IsString()
  taxNumber: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
