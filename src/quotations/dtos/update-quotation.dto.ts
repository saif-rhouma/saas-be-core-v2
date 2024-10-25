/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ProductQty } from './create-quotation.dto';

export class UpdateQuotationDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  quotationDate: Date;

  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  isHidden: boolean;

  @IsNumber()
  @IsOptional()
  customer: number;

  @IsString()
  @IsOptional()
  status: string;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiredDate: Date;

  @IsObject()
  @IsOptional()
  order: any;

  @IsArray()
  @IsOptional()
  products: ProductQty[];
}
