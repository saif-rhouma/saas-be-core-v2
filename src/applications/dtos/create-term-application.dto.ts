/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { TermsCondition } from '../entities/application.entity';

class TermsConditionDto implements TermsCondition {
  @IsString()
  title: string;
  @IsString()
  description: string;
}

export class CreateTermsApplicationDto {
  @IsNumber()
  appId: number;

  @ValidateNested({ each: true })
  @Type(() => TermsConditionDto)
  @IsNotEmpty()
  terms: TermsConditionDto[];
}
