/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { ProductService } from 'src/products/services/products.service';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { Plan, PlanStatus } from '../entities/plan.entity';
import { StockService } from 'src/stock/services/stock.service';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private repo: Repository<Plan>,
    private usersService: UsersService,
    private productsService: ProductService,
    private applicationsService: ApplicationsService,
    @Inject(forwardRef(() => StockService))
    private stockService: StockService,
    // private supplyingService: SupplyingService,
  ) {}

  async createPlan(
    planData: Partial<Plan>,
    userId: number,
    productId: number,
    applicationId: number,
    order: Order = undefined,
  ) {
    const plan = this.repo.create({ ...planData });
    if (!userId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }

    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    if (order) {
      plan.order = order;
    }

    plan.createdBy = user;
    plan.product = product;
    plan.application = application;
    // const suppData = new Supplying();
    // suppData.orderedAt = new Date();
    // suppData.quantity = plan.quantity;
    // await this.supplyingService.createSupplying(suppData, plan, product);
    return this.repo.save(plan);
  }

  findByCreatedUser(userId: number) {
    if (!userId) {
      return null;
    }
    const plan = this.repo.find({ where: { createdBy: { id: userId } } });
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return plan;
  }

  findAllByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const plan = this.repo.find({
      where: { application: { id: appId } },
      relations: { product: true, createdBy: true, order: true },
    });
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return plan;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const plan = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: { product: true, order: true },
    });
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return plan;
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    const plan = await this.repo.findOne({ where: { id }, relations: { product: true } });
    return plan;
  }

  async update(id: number, appId: number, attrs: Partial<Plan>, productId: number) {
    let product;
    const plan = await this.findOneByApplication(id, appId);
    if (productId) {
      product = await this.productsService.findOne(productId);
      if (!product) {
        throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
      }
      plan.product = product;
    }

    Object.assign(plan, attrs);
    return this.repo.save(plan);
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const plan = await this.findOneByApplication(id, appId);
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return this.repo.remove(plan);
  }

  async transferToStock(planId: number, appId: number) {
    const plan = await this.findOne(planId);
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    if (!plan.isTransferred) {
      await this.stockService.createFromPlan(plan.quantity, plan.product, appId);
      plan.isTransferred = true;
      return this.repo.save(plan);
    }
    return plan;
  }

  async getStockPlan(appId: number) {
    const res = await this.repo.manager.query(
      `SELECT 
    pln.productId, prod.name, prod.image,
    SUM(CASE WHEN status = '${PlanStatus.Ready}' THEN pln.quantity ELSE 0 END) AS ready_quantity,
    SUM(CASE WHEN status = '${PlanStatus.Pending}' THEN pln.quantity ELSE 0 END) AS pending_quantity,
    SUM(CASE WHEN status = '${PlanStatus.ProcessingA}' THEN pln.quantity ELSE 0 END) AS processing_a_quantity,
    SUM(CASE WHEN status = '${PlanStatus.ProcessingB}' THEN pln.quantity ELSE 0 END) AS processing_b_quantity,
    SUM(pln.quantity) AS totals_quantity
    FROM "plan" pln
    JOIN product prod ON prod.id = pln.productId 
    WHERE pln.applicationId = ${appId}
    GROUP BY pln.productId;`,
    );

    return res;
  }
}
