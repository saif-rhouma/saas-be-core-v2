/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';

export class UpdateTicketMessageDto {
  @IsNumber()
  id: number;
  @IsString()
  message: string;
}
