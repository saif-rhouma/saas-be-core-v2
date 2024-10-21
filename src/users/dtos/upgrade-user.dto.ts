/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountType } from '../entities/user.entity';

export class UpgradeUserDto {
  @IsEnum(AccountType)
  @IsNotEmpty()
  accountType: string;
}
