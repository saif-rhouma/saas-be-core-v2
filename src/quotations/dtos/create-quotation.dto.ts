/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export interface ProductQty {
  id: number;
  snapshotProductPrice: number;
  quantity: number;
}

export class CreateQuotationDto {
  @IsDate()
  @Type(() => Date)
  quotationDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiredDate: Date;

  @IsNumber()
  customer: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  discount: number;

  @IsArray()
  products: ProductQty[];
}
