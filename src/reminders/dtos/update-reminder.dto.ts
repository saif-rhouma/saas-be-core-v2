/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateReminderDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  reminderDate: Date;
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  file: string;
}
