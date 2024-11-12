/* eslint-disable prettier/prettier */
import { Optional } from '@nestjs/common';
import { Address } from 'nodemailer/lib/mailer';

export class SendEmailDto {
  from: Address;
  recipients: Address;
  subject: string;
  html: string;
  text: string;
  @Optional()
  cc: Address[];
  attachments: { filename: string; path: string }[];
}
