/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplying, SupplyingStatus } from '../entities/supplying.entity';
import { Repository } from 'typeorm';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { Plan } from 'src/plans/entities/plan.entity';

@Injectable()
export class SupplyingService {
  constructor(@InjectRepository(Supplying) private repo: Repository<Supplying>) {}

  async createSupplying(suppData: Partial<Supplying>, plan, product) {
    const supplying = this.repo.create(suppData);
    supplying.plan = plan;
    supplying.product = product;
    await this.repo.save(supplying);
    return supplying;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const supplying = this.repo.findOneBy({ id });
    return supplying;
  }

  async findOneByPlan(planId: number) {
    if (!planId) {
      return null;
    }
    const supplying = await this.repo.findOne({ where: { plan: { id: planId } } });
    if (!supplying) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_SUPPLY);
    }
    return supplying;
  }

  async remove(id: number) {
    if (!id) {
      return null;
    }
    const supplying = await this.findOne(id);
    if (!supplying) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_SUPPLY);
    }
    return this.repo.remove(supplying);
  }

  async updateStatus(planId: number, status: SupplyingStatus) {
    const supplying = await this.findOneByPlan(planId);
    supplying.status = status;
    await this.repo.save(supplying);
    return supplying;
  }

  async updateQuantity(planId: number, quantity: number) {
    const supplying = await this.findOneByPlan(planId);
    supplying.quantity = quantity;
    await this.repo.save(supplying);
    return supplying;
  }

  async update(plan: Plan, attrs: Partial<Supplying>) {
    const supplying = await this.findOneByPlan(plan.id);
    supplying.quantity = plan.quantity;
    supplying.product = plan.product;
    Object.assign(supplying, attrs);
    return this.repo.save(supplying);
  }
}
