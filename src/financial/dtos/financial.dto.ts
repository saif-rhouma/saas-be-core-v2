/* eslint-disable prettier/prettier */
import { Expose, Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class FinancialDto {
  @Expose()
  year: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;
}
