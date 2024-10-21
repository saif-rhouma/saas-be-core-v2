/* eslint-disable prettier/prettier */
import { IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  printerPOS;

  @IsOptional()
  @IsString()
  currencySymbol;

  @IsOptional()
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

  @IsOptional()
  @IsNumber()
  financialYear: number;
}
