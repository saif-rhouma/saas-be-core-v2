/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class ShareQuotationDto {
  @IsString()
  id: string;
}
