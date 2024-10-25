import { forwardRef, Module } from '@nestjs/common';
import { RemindersService } from './services/reminders.service';
import { RemindersController } from './controllers/reminders.controller';
import { Reminder } from './entities/reminder.entity';
import { Application } from 'src/applications/entities/application.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsModule } from 'src/applications/applications.module';
import { UsersModule } from 'src/users/users.module';
import { ReminderSubscriber } from './subscribers/reminder.subscriber';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { QuotationsModule } from 'src/quotations/quotations.module';

@Module({
  providers: [RemindersService, ReminderSubscriber],
  controllers: [RemindersController],
  imports: [
    UsersModule,
    ApplicationsModule,
    QuotationsModule,
    TypeOrmModule.forFeature([User, Application, Reminder]),
    forwardRef(() => NotificationsModule),
  ],
  exports: [RemindersService],
})
export class RemindersModule {}
