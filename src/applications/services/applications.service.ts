/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from '../entities/application.entity';
import { Repository } from 'typeorm';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UsersService } from 'src/users/services/users.service';
import { UpdateApplicationDto } from '../dtos/update-application.dto';
import { FinancialService } from 'src/financial/services/financial.service';
import { Logger } from 'winston';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private repo: Repository<Application>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => FinancialService))
    private readonly financialService: FinancialService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async createApplication(applicationData: Partial<Application>, userId: number) {
    try {
      const application = this.repo.create({ ...applicationData });
      if (!userId) {
        return null;
      }
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
      }
      application.owner = user;
      return this.repo.save(application);
    } catch (error) {
      this.logger.error('Create Application : ', error);
      return null;
    }
  }

  findByName(applicationName: string) {
    try {
      return this.repo.find({ where: { name: applicationName } });
    } catch (error) {
      this.logger.error('Fine By Name App : ', error);
      return null;
    }
  }

  findByOwnerId(ownerId: number) {
    try {
      if (!ownerId) {
        return null;
      }
      const application = this.repo.find({ where: { owner: { id: ownerId } } });
      if (!application) {
        throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
      }
      return application;
    } catch (error) {
      this.logger.error('Find By Owner ID APP : ', error);
      return null;
    }
  }

  findOne(id: number) {
    try {
      if (!id) {
        return null;
      }
      const application = this.repo.findOne({ where: { id }, relations: { financialYear: true } });
      return application;
    } catch (error) {
      this.logger.error('Fine one App : ', error);
      return null;
    }
  }

  async update(id: number, attrs: Partial<UpdateApplicationDto>) {
    try {
      const application = await this.findOne(id);
      if (!application) {
        throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
      }
      if (attrs.financialYear) {
        const financial = await this.financialService.findOne(attrs.financialYear);
        if (!financial) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_FINANCIAL_YEAR);
        }
        application.financialYear = financial;
        delete attrs.financialYear;
      }

      Object.assign(application, attrs);
      return this.repo.save(application);
    } catch (error) {
      this.logger.error('Update App : ', error);
      return null;
    }
  }

  async remove(id: number) {
    try {
      const application = await this.findOne(id);
      if (!application) {
        throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
      }
      return this.repo.remove(application);
    } catch (error) {
      this.logger.error('Remove App : ', error);
      return null;
    }
  }
}
