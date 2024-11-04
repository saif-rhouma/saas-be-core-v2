/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentType } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsDate()
  @Type(() => Date)
  paymentDate: Date;

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsNumber()
  customerId: number;

  @IsString()
  orderId: string;

  @IsString()
  @IsOptional()
  attachments: string;
}
