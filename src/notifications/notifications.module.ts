/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
// import { RemindersModule } from 'src/reminders/reminders.module';
import { NotificationsService } from './services/notifications.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RemindersModule } from 'src/reminders/reminders.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { MailerService } from './services/mailer.service';
@Module({
  controllers: [NotificationsController],
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    forwardRef(() => RemindersModule),
    forwardRef(() => TicketsModule),
  ],
  providers: [NotificationsService, NotificationsGateway, MailerService],
  exports: [NotificationsService, NotificationsGateway, MailerService],
})
export class NotificationsModule {}
