/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';

export class TicketMessageDto {
  @Expose()
  message: string;
  @Expose()
  ticketId: number;
  @Expose()
  id: number;
}
