import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentType } from '../entities/payment.entity';

export class UpdatePaymentDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  paymentDate: Date;

  @IsEnum(PaymentType)
  @IsOptional()
  paymentType: PaymentType;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  attachments: string;
}
