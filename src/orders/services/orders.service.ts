/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { CustomersService } from 'src/customers/services/customers.service';
import { ProductService } from 'src/products/services/products.service';
import { UsersService } from 'src/users/services/users.service';
import { Not, Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Order, OrderStatus } from '../entities/order.entity';
import { ProductOrderService } from './product-order.service';
import { Operation, StockService } from 'src/stock/services/stock.service';
import { PlansService } from 'src/plans/services/plans.service';
import { Plan } from 'src/plans/entities/plan.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private usersService: UsersService,
    private customersService: CustomersService,
    private applicationsService: ApplicationsService,
    private productOrderService: ProductOrderService,
    private productsService: ProductService,
    private stockService: StockService,
    private plansService: PlansService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async createOrder(orderData: CreateOrderDto, userId: number, applicationId: number) {
    if (!userId || !applicationId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const customer = await this.customersService.findOne(orderData.customer);
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }

    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    const productsIds = orderData.products.map((product) => product.id);

    const products = await this.productsService.findByIds(applicationId, productsIds);
    if (!products) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    let totalAmount = 0;

    products.forEach((prod) => {
      const prd = orderData.products.find((prd) => prd.id === prod.id);
      if (prd) {
        totalAmount += prd.snapshotProductPrice * prd.quantity;
      }
    });

    const order = new Order();

    order.orderDate = orderData.orderDate;
    order.application = application;
    order.createdBy = user;
    order.customer = customer;
    order.discount = orderData.discount;
    order.totalOrderAmount = totalAmount;

    const preOrder = this.repo.create({ ...order });
    const resOrder = await this.repo.save(preOrder);

    await this.productOrderService.assignProductToOrder(preOrder, orderData.products, products);

    return resOrder;
  }

  findAllByApplication(appId: number) {
    if (!appId || isNaN(appId)) {
      return null;
    }
    const orders = this.repo.find({
      where: { application: { id: appId } },
      relations: ['productToOrder', 'productToOrder.product', 'customer'],
      order: { orderDate: 'ASC' },
    });
    if (!orders) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return orders;
  }

  findAllActiveByApplication(appId: number) {
    if (!appId || isNaN(appId)) {
      return null;
    }
    const orders = this.repo.find({
      where: { status: Not(OrderStatus.Draft), application: { id: appId } },
      relations: ['productToOrder', 'productToOrder.product', 'customer'],
    });
    if (!orders) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return orders;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const order = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: ['productToOrder', 'productToOrder.product', 'customer', 'payments', 'application'],
    });
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return order;
  }

  async findOneByApplicationDetailed(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const order = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: ['productToOrder', 'productToOrder.product.stock'],
    });
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return order;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const order = this.repo.findOneBy({ id });
    return order;
  }

  async update(id: number, appId: number, attrs: Partial<UpdateOrderDto>) {
    const order = await this.findOneByApplication(id, appId);
    Object.assign(order, attrs);
    return this.repo.save(order);
  }

  async approveAndCreatePlans(data, userId: number, appId: number) {
    const orderId = data[0].orderId;
    const completeOrder = await this.findOne(orderId);
    for (const order of data) {
      const plan = new Plan();
      plan.planDate = new Date();
      plan.quantity = Math.abs(order.missingQuantity);
      await this.plansService.createPlan(plan, userId, order.product.id, appId, completeOrder);
    }
    return this.update(orderId, appId, { status: OrderStatus.InProcess });
  }

  async detailsApprove(id: number, appId: number) {
    const order = await this.findOneByApplicationDetailed(id, appId);
    // const ProductList
    return order;
  }

  async updateStatus(id: number, appId: number, attrs: Partial<UpdateOrderDto>) {
    const order = await this.findOneByApplication(id, appId);
    const prevStatus = order.status;
    Object.assign(order, attrs);
    if (order.status === OrderStatus.Delivered && !order.subProductStock) {
      const res = await this.stockService.updateFromOrder(order, appId);
      Object.assign(order, res);
    } else if (prevStatus === OrderStatus.Delivered && order.subProductStock) {
      const res = await this.stockService.updateFromOrder(order, appId, Operation.ADD);
      Object.assign(order, res);
    }
    return this.repo.save(order);
  }

  // async remove(id: number, appId: number) {
  //   if (!id || !appId) {
  //     return null;
  //   }
  //   const order = await this.findOneByApplication(id, appId);
  //   if (!order) {
  //     throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
  //   }
  //   await this.productOrderService.remove(id);
  //   return this.repo.remove(order);
  // }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const order = await this.findOneByApplication(id, appId);
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return this.update(id, appId, { status: OrderStatus.Canceled });
  }

  async addAmount(order: Order, amount: number) {
    order.orderPaymentAmount += amount;
    await this.repo.save(order);
  }
  async subAmount(order: Order, amount: number) {
    order.orderPaymentAmount -= amount;
    await this.repo.save(order);
  }

  async updateAmount(order: Order) {
    try {
      const [{ total }] = await this.repo.manager.query(
        `SELECT SUM(p.amount) as total
        FROM "order" o LEFT JOIN payment p 
        ON p.orderId = o.id
        WHERE o.id = ${order.id};`,
      );

      if (total) {
        order.orderPaymentAmount = total;
        await this.repo.save(order);
      }
    } catch (error) {}
  }

  async analytics(appId: number) {
    try {
      if (!appId) {
        return null;
      }
      const analytics = await this.repo.manager.query(
        `select SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) As Ready,
    SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS Delivered,
    SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS InProcess from 'order'
    where applicationId = ${appId};`,
      );
      const inProcessLastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.InProcess}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      const readyLastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Ready}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      const deliveredLastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Delivered}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      const lastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      return { analytics: analytics[0], lastSixMonth, readyLastSixMonth, deliveredLastSixMonth, inProcessLastSixMonth };
    } catch (error) {}
  }

  async analyticsAdvance(appId: number) {
    try {
      if (!appId) {
        return null;
      }
      const analytics = await this.repo.manager.query(
        `select SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) As Ready,
    SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS Delivered,
    SUM(CASE WHEN status = '${OrderStatus.Draft}' THEN 1 ELSE 0 END) AS Draft,
    SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS InProcess,
    COUNT(*) AS Total
    from 'order'
    where applicationId = ${appId};`,
      );
      const readyLastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Ready}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      const draftLastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Draft}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      const inProcessLastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.InProcess}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      const deliveredLastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Delivered}' and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      const lastSixMonth = await this.repo.manager.query(
        `SELECT  COUNT(id) AS ClaimsPerMonth,
      (strftime('%m', orderDate)) AS inMonth,
      (strftime('%Y', orderDate)) AS inYear  FROM 'order'
      WHERE orderDate >= DATE('now', '-7 months') and applicationId = ${appId}
      GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
      ORDER BY inYear, inMonth`,
      );
      return {
        analytics: analytics[0],
        lastSixMonth,
        draftLastSixMonth,
        inProcessLastSixMonth,
        readyLastSixMonth,
        deliveredLastSixMonth,
      };
    } catch (error) {}
  }

  findLatestOrders(appId: number) {
    if (!appId) {
      return null;
    }
    const LIMIT_ROW = 5;
    const orders = this.repo.find({
      where: { application: { id: appId } },
      order: { createTime: 'ASC' },
      take: LIMIT_ROW,
      relations: ['productToOrder', 'productToOrder.product', 'customer'],
    });
    if (!orders) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return orders;
  }
}
