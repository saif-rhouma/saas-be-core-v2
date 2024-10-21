/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class CreatePlanDto {
  @IsDate()
  @Type(() => Date)
  planDate: Date;
  @IsNumber()
  quantity: number;
  @IsNumber()
  productId: number;
}
