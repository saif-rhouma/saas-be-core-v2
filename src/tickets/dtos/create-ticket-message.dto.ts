/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';

export class CreateTicketMessageDto {
  @IsString()
  message: string;
  @IsNumber()
  ticketId: number;
}
