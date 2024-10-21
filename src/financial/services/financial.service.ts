import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Financial } from '../entities/financial-year.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { CreateFinancialDto } from '../dtos/create-financial.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateFinancialDto } from '../dtos/update-financial.dto';

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(Financial) private repo: Repository<Financial>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => ApplicationsService))
    private readonly applicationsService: ApplicationsService,
  ) {}

  async createFinancial(financialData: Partial<CreateFinancialDto>, applicationId: number, userId: number) {
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
    const financial = this.repo.create({ ...financialData });
    financial.createdBy = user;
    financial.application = application;
    return this.repo.save(financial);
  }

  findAllByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const financials = this.repo.find({
      where: { application: { id: appId } },
    });
    if (!financials) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_FINANCIAL_YEAR);
    }
    return financials;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const financial = await this.repo.findOne({
      where: { id, application: { id: appId } },
    });
    if (!financial) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_FINANCIAL_YEAR);
    }
    return financial;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const financial = this.repo.findOneBy({ id });
    return financial;
  }

  async update(id: number, appId: number, financialData: Partial<UpdateFinancialDto>) {
    const financial = await this.repo.findOne({ where: { id, application: { id: appId } } });
    if (!financial) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_FINANCIAL_YEAR);
    }
    Object.assign(financial, financialData);
    return this.repo.save(financial);
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const financial = await this.findOneByApplication(id, appId);
    if (!financial) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_FINANCIAL_YEAR);
    }
    return this.repo.remove(financial);
  }
}
