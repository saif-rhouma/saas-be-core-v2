/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsNumber()
  @IsOptional()
  categoryId: number;
}
