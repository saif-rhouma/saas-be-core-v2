/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber } from 'class-validator';

interface ProductQty {
  id: number;
  snapshotProductPrice: number;
  quantity: number;
}

export class CreateOrderDto {
  @IsDate()
  @Type(() => Date)
  orderDate: Date;

  @IsNumber()
  customer: number;

  @IsNumber()
  discount: number;

  @IsArray()
  products: ProductQty[];
}
