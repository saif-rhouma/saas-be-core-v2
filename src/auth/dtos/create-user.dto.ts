/* eslint-disable prettier/prettier */
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
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

  @IsString()
  phoneNumber: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsOptional()
  @IsArray()
  Permissions: string[];
}
