/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdatePlanDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  planDate: Date;
  @IsNumber()
  @IsOptional()
  quantity: number;
  @IsNumber()
  @IsOptional()
  productId: number;
}
