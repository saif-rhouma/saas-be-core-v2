/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePermissionsGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  permissionsList: any[];
}
