/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from '../dtos/send-mail.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly config: ConfigService) {}

  private mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('smtpSetting.host'),
      port: parseInt(this.config.get<string>('smtpSetting.port')),
      secure: true, // true for port 465, false for other ports
      auth: {
        user: this.config.get<string>('smtpSetting.username'),
        pass: this.config.get<string>('smtpSetting.password'),
      },
    });

    return transporter;
  }
  async sendEmail(data: Partial<SendEmailDto>) {
    const { from, recipients, subject, html, cc } = data;

    const transporter = this.mailTransport();
    const options: Mail.Options = {
      from: from ?? {
        name: this.config.get<string>('appName'),
        address: this.config.get<string>('smtpSetting.defaultMailFrom'),
      },
      to: recipients,
      cc,
      subject,
      html,
    };
    try {
      const res = await transporter.sendMail(options);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}
