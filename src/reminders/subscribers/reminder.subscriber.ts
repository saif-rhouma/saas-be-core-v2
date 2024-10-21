/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { CronJob } from 'cron';
import { NotificationType } from 'src/common/constants/notification';
import { isDateTimeInPast } from 'src/common/helpers/date-funcs';
import { NotificationsGateway } from 'src/notifications/gateway/notifications.gateway';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';
import { RemindersService } from '../services/reminders.service';
import { MailerService } from 'src/notifications/services/mailer.service';
import { getHtmlString } from 'src/common/constants/mail-html-template';
import { SendEmailDto } from 'src/notifications/dtos/send-mail.dto';

@EventSubscriber()
export class ReminderSubscriber implements EntitySubscriberInterface<Reminder> {
  private jobs: { [key: string]: CronJob } = {}; // Store active cron jobs

  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly notificationGateway: NotificationsGateway,
    private readonly remindersService: RemindersService,
    private readonly mailerService: MailerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Reminder;
  }

  /**
   * Called after entity insert.
   */
  afterInsert(event: InsertEvent<Reminder>) {
    this.handleReminderCreation(event.entity);
  }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<Reminder>) {
    this.handleReminderReschedule(event.entity as Reminder);
  }

  /**
   * Called after entity delete.
   */
  afterRemove(event: RemoveEvent<Reminder>) {
    this.handleReminderCancel(event.entity.id);
  }

  async handleReminderCreation(reminder: Reminder) {
    const reminderTime = new Date(reminder.reminderDate);

    const job = new CronJob(reminderTime, async () => {
      this.sendNotificationToClient(
        reminder.createdBy.id.toString(),
        `Reminder: ${reminder.title}`,
        NotificationType.ALARM,
        reminder,
      );

      await this.sendEmailToClient(reminder);

      await this.remindersService.isNotifiedChange(reminder.id, false);
      // After the job is done, stop and delete it
      this.jobs[reminder.id]?.stop();
      delete this.jobs[reminder.id];
    });

    // Start the cron job
    job.start();

    // Store the job to manage it later (e.g., stop or delete)
    this.jobs[reminder.id] = job;
  }

  async handleReminderReschedule(reminder: Reminder) {
    if (!isDateTimeInPast(reminder.reminderDate)) {
      if (this.jobs[reminder.id]) {
        this.jobs[reminder.id].stop();
        delete this.jobs[reminder.id];
      }
      this.handleReminderCreation(reminder);
    }
  }

  async handleReminderCancel(reminderId: number) {
    if (this.jobs[reminderId]) {
      this.jobs[reminderId].stop();
      delete this.jobs[reminderId];
    }
  }

  // Function to send the notification to a specific client
  sendNotificationToClient(clientId: string, message: string, type: NotificationType, data: any) {
    this.notificationGateway.handleNotificationMessage(clientId, { message, type, data });
  }

  async sendEmailToClient(reminder: Reminder) {
    try {
      const mail: Partial<SendEmailDto> = {
        from: {
          name: reminder.application.name,
          address: 'test@saascore.com',
        },
        recipients: {
          name: reminder.createdBy.firstName,
          address: reminder.createdBy.email,
        },
        subject: reminder.title,
        html: getHtmlString(reminder.title, reminder.description),
      };
      return this.mailerService.sendEmail(mail);
    } catch (error) {
      console.log(error);
    }
  }
}
