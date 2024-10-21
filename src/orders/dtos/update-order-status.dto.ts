import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsOptional()
  status: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  deliveryDate: Date;
}
