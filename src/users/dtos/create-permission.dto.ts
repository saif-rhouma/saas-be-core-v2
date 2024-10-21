/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PermissionType } from 'src/common/constants/permissions';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsEnum(PermissionType)
  @IsNotEmpty()
  slug: string;

  @IsString()
  @MaxLength(255)
  description: string;

  // Other Attribute will be ADDED!
}
