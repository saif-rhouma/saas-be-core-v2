/* eslint-disable prettier/prettier */
import { IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  printerPOS;

  @IsString()
  currencySymbol;

  @IsNumber()
  taxPercentage;

  @IsOptional()
  @IsString()
  appLogo: string;

  @IsOptional()
  @IsString()
  favicon: string;

  @IsOptional()
  @IsNumber()
  taxNumber;

  @IsOptional()
  @IsObject()
  address: any;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  description: string;
}
