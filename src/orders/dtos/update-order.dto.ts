/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  orderDate: Date;

  @IsBoolean()
  @IsOptional()
  isHidden: boolean;

  @IsString()
  @IsOptional()
  status: string;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  deliveryDate: Date;
}
