/* eslint-disable prettier/prettier */
import { IsArray, IsBoolean, IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStaffDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsOptional()
  @IsArray()
  permissions: any[];

  @IsOptional()
  @IsNumber()
  permissionsGroup: number;
}
