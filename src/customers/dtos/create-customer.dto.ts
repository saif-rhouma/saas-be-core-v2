/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
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
