/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator';
export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  status;
}
