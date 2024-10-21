/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateFinancialDto {
  @IsString()
  year: string;
  @IsDate()
  @Type(() => Date)
  startDate: Date;
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
