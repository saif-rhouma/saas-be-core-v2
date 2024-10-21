/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  @IsNotEmpty()
  product: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
