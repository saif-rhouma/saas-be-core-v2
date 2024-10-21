/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateReminderDto } from '../dtos/create-reminder.dto';
import { UpdateReminderDto } from '../dtos/update-reminder.dto';
import { Reminder } from '../entities/reminder.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder) private repo: Repository<Reminder>,
    private usersService: UsersService,
    private applicationsService: ApplicationsService,
  ) {}

  async createReminder(reminderData: Partial<CreateReminderDto>, applicationId: number, userId: number) {
    if (!userId || !applicationId) {
      return null;
    }
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const reminder = this.repo.create({ ...reminderData });

    reminder.createdBy = user;
    reminder.application = application;
    return this.repo.save(reminder);
  }

  findAllByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const reminders = this.repo.find({
      where: { application: { id: appId } },
    });
    if (!reminders) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_REMINDER);
    }
    return reminders;
  }

  findAll() {
    return this.repo.find();
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const reminder = await this.repo.findOne({
      where: { id, application: { id: appId } },
    });
    if (!reminder) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_REMINDER);
    }
    return reminder;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const reminder = this.repo.findOneBy({ id });
    return reminder;
  }

  async update(id: number, appId: number, reminderData: Partial<UpdateReminderDto>) {
    const reminder = await this.repo.findOne({ where: { id, application: { id: appId } } });
    if (!reminder) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_REMINDER);
    }
    Object.assign(reminder, reminderData);
    return this.repo.save(reminder);
  }

  async isNotifiedChange(id: number, notifyValue: boolean) {
    const reminder = await this.findOne(id);
    if (!reminder) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_REMINDER);
    }
    Object.assign(reminder, { isNotified: notifyValue });
    return this.repo.save(reminder);
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const reminder = await this.findOneByApplication(id, appId);
    if (!reminder) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_REMINDER);
    }
    return this.repo.remove(reminder);
  }
}
