/* eslint-disable prettier/prettier */
import { IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  @MaxLength(255)
  description: string;

  // Other Attribute will be ADDED!
}
