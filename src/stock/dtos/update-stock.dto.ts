/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateStockDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
