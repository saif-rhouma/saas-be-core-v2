/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsDate()
  @Type(() => Date)
  reminderDate: Date;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  @IsOptional()
  file: string;
}
