import { Address } from 'nodemailer/lib/mailer';

/* eslint-disable prettier/prettier */
export class SendEmailDto {
  from: Address;
  recipients: Address;
  subject: string;
  html: string;
  text: string;
}
