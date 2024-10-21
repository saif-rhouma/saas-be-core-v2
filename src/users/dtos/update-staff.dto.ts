/* eslint-disable prettier/prettier */
import { IsArray, IsBoolean, IsEmail, IsJSON, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateStaffDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsJSON()
  @IsOptional()
  applicationThemeSetting;

  @IsJSON()
  @IsOptional()
  address;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsOptional()
  @IsArray()
  permissions: any[];

  @IsOptional()
  @IsNumber()
  permissionsGroup: number;
}
