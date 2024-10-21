/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductAddonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  isActive: boolean;
}
