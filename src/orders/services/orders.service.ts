/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { PermissionType } from 'src/common/constants/permissions';
import { RoleType } from 'src/common/constants/roles';
import { CustomersService } from 'src/customers/services/customers.service';
import { Plan } from 'src/plans/entities/plan.entity';
import { PlansService } from 'src/plans/services/plans.service';
import { ProductService } from 'src/products/services/products.service';
import { Operation, StockService } from 'src/stock/services/stock.service';
import { UsersService } from 'src/users/services/users.service';
import { Not, Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Order, OrderStatus } from '../entities/order.entity';
import { ProductOrderService } from './product-order.service';
import { Payment } from 'src/payments/entities/payment.entity';
import { ConfigService } from '@nestjs/config';
import { DATABASE_TYPE } from 'src/common/constants/global';

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
    private readonly config: ConfigService,
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

  async findAllByApplication(appId: number) {
    if (!appId || isNaN(appId)) {
      return null;
    }
    // const orders = this.repo.find({
    //   where: { application: { id: appId } },
    //   relations: ['productToOrder', 'productToOrder.product', 'customer'],
    //   order: { ref: 'ASC' },
    // });
    const orders = await this.repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.createdBy', 'user')
      .leftJoinAndSelect('order.productToOrder', 'productToOrder')
      .leftJoinAndSelect('productToOrder.product', 'product')
      .leftJoinAndSelect('order.customer', 'customer')
      .where('order.applicationId = :appId', { appId })
      .orderBy('CAST(SUBSTRING(order.ref, 4, LENGTH(order.ref)) AS UNSIGNED)', 'ASC')
      .getMany();
    if (!orders) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return orders;
  }

  async findAllByApplicationAdvanced(userId: number, appId: number) {
    if (!appId || isNaN(appId)) {
      return null;
    }

    const user = await this.usersService.getDetails(userId);

    if (user.roles.map((role) => role.name).includes(RoleType.STAFF)) {
      // TODO PermissionType.LIST_ORDER SHOULD BE CHANGED !!!
      if (!user.permissions.map((permission) => permission.slug).includes(PermissionType.GROUP_ORDER_LIST)) {
        const orders = await this.repo
          .createQueryBuilder('order')
          .leftJoinAndSelect('order.createdBy', 'user')
          .leftJoinAndSelect('order.productToOrder', 'productToOrder')
          .leftJoinAndSelect('productToOrder.product', 'product')
          .leftJoinAndSelect('order.customer', 'customer')
          .where('order.applicationId = :appId', { appId })
          .andWhere('order.createdBy = :userId', { userId })
          .orderBy('CAST(SUBSTRING(order.ref, 4, LENGTH(order.ref)) AS UNSIGNED)', 'ASC')
          .getMany();
        if (!orders) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
        }
        return orders;
      }
    }

    const orders = await this.repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.createdBy', 'user')
      .leftJoinAndSelect('order.productToOrder', 'productToOrder')
      .leftJoinAndSelect('productToOrder.product', 'product')
      .leftJoinAndSelect('order.customer', 'customer')
      .where('order.applicationId = :appId', { appId })
      .orderBy('CAST(SUBSTRING(order.ref, 4, LENGTH(order.ref)) AS UNSIGNED)', 'ASC')
      .getMany();

    if (!orders) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return orders;
  }

  async findAllActiveByApplication(userId: number, appId: number) {
    if (!appId || isNaN(appId)) {
      return null;
    }

    const user = await this.usersService.getDetails(userId);

    if (user.roles.map((role) => role.name).includes(RoleType.STAFF)) {
      // TODO PermissionType.LIST_ORDER SHOULD BE CHANGED !!!
      if (!user.permissions.map((permission) => permission.slug).includes(PermissionType.GROUP_ORDER_LIST)) {
        const orders = await this.repo
          .createQueryBuilder('order')
          .leftJoinAndSelect('order.productToOrder', 'productToOrder')
          .leftJoinAndSelect('productToOrder.product', 'product')
          .leftJoinAndSelect('order.customer', 'customer')
          .where('order.status != :status', { status: OrderStatus.Draft })
          .andWhere('order.applicationId = :appId', { appId })
          .andWhere('order.createdBy = :userId', { userId })
          .getMany();

        if (!orders) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
        }
        return orders;
      }
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

  async findOneByApplication(id: string, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const order = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: [
        'productToOrder',
        'productToOrder.product',
        'customer',
        'payments',
        'application',
        'quotation',
        'createdBy',
      ],
    });
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return order;
  }

  async findPdf(id: string) {
    if (!id) {
      return null;
    }
    const order = await this.repo.findOne({
      where: { id },
      relations: {
        application: true,
        productToOrder: {
          product: true,
        },
        customer: true,
        quotation: true,
      },
    });
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return order;
  }

  async findOneByApplicationDetailed(id: string, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const order = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: ['productToOrder', 'productToOrder.product.stock', 'createdBy'],
    });
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return order;
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    const order = this.repo.findOneBy({ id });
    return order;
  }

  async update(id: string, appId: number, attrs: Partial<UpdateOrderDto>) {
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

  async detailsApprove(id: string, appId: number) {
    const order = await this.findOneByApplicationDetailed(id, appId);
    return order;
  }

  async updateStatus(id: string, appId: number, attrs: Partial<UpdateOrderDto>) {
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

  async remove(id: string, appId: number) {
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
      if (this.config.get('databaseType') === DATABASE_TYPE.MYSQL) {
        //? NOTES: MySQL Query
        const [{ total }] = await this.repo.manager.query(
          `SELECT SUM(p.amount) as total
         FROM \`order\` o
         LEFT JOIN payment p ON p.orderId = o.id
         WHERE o.id = ?;`,
          [order.id],
        );

        if (total) {
          order.orderPaymentAmount = total;
          await this.repo.save(order);
        }
      } else {
        const [{ total }] = await this.repo.manager.query(
          `SELECT SUM(p.amount) as total
          FROM "order" o LEFT JOIN payment p
          ON p.orderId = o.id
          WHERE o.id = '${order.id}';`,
        );

        if (total) {
          order.orderPaymentAmount = total;
          await this.repo.save(order);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async syncAmount(payment: Payment, order: Order) {
    try {
      if (this.config.get('databaseType') === DATABASE_TYPE.MYSQL) {
        //? NOTES: MySQL Query
        const [{ total }] = await this.repo.manager.query(
          `SELECT SUM(p.amount) as total
         FROM \`order\` o
         LEFT JOIN payment p ON p.orderId = o.id
         WHERE o.id = ? AND p.id <> ?;`,
          [order.id, payment.id],
        );
        if (total) {
          order.orderPaymentAmount = parseInt(total) + payment.amount;
          await this.repo.save(order);
        }
      } else {
        const [{ total }] = await this.repo.manager.query(
          `SELECT SUM(p.amount) as total
        FROM "order" o LEFT JOIN payment p
        ON p.orderId = o.id
        WHERE o.id = '${order.id}' AND p.id <> ${payment.id};`,
        );
        if (total) {
          order.orderPaymentAmount = parseInt(total) + payment.amount;
          await this.repo.save(order);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async analytics(appId: number) {
    try {
      if (!appId) {
        return null;
      }
      if (this.config.get('databaseType') === DATABASE_TYPE.MYSQL) {
        //? NOTES: MySQL Query
        const analytics = await this.repo.manager.query(
          `SELECT 
          SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS Ready,
          SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS Delivered,
          SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS InProcess
       FROM \`order\`
       WHERE applicationId = ?;`,
          [OrderStatus.Ready, OrderStatus.Delivered, OrderStatus.InProcess, appId],
        );
        //? NOTES: MySQL Query
        const inProcessLastSixMonth = await this.repo.manager.query(
          `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = ?
           AND applicationId = ?
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
          [OrderStatus.InProcess, appId],
        );
        //? NOTES: MySQL Query
        const readyLastSixMonth = await this.repo.manager.query(
          `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = ?
           AND applicationId = ?
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
          [OrderStatus.Ready, appId],
        );
        //? NOTES: MySQL Query
        const deliveredLastSixMonth = await this.repo.manager.query(
          `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = ?
           AND applicationId = ?
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
          [OrderStatus.Delivered, appId],
        );
        //? NOTES: MySQL Query
        const lastSixMonth = await this.repo.manager.query(
          `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND applicationId = ?
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
          [appId],
        );

        return {
          analytics: analytics[0],
          lastSixMonth,
          readyLastSixMonth,
          deliveredLastSixMonth,
          inProcessLastSixMonth,
        };
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

      const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if (this.config.get('databaseType') === DATABASE_TYPE.MYSQL) {
        //? NOTES: MySQL Query
        const queryRes = await this.repo
          .createQueryBuilder('order')
          .select('YEAR(order.orderDate)', 'year')
          .addSelect('MONTH(order.orderDate)', 'month')
          .addSelect(`SUM(CASE WHEN order.status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END)`, 'readyCount')
          .addSelect(`SUM(CASE WHEN order.status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END)`, 'deliveredCount')
          .addSelect(`SUM(CASE WHEN order.status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END)`, 'progressCount')
          .where('order.applicationId = :appId', { appId })
          .groupBy('year')
          .addGroupBy('month')
          .orderBy('year', 'ASC')
          .addOrderBy('month', 'ASC')
          .getRawMany();

        const seriesData: { [year: string]: { Ready: number[]; Delivered: number[]; InProcess: number[] } } = {};

        queryRes.forEach((entry) => {
          const year = entry.year;
          const monthIndex = parseInt(entry.month, 10) - 1;

          if (!seriesData[year]) {
            seriesData[year] = { Ready: Array(12).fill(0), Delivered: Array(12).fill(0), InProcess: Array(12).fill(0) };
          }

          seriesData[year].Ready[monthIndex] = parseInt(entry.readyCount, 10);
          seriesData[year].Delivered[monthIndex] = parseInt(entry.deliveredCount, 10);
          seriesData[year].InProcess[monthIndex] = parseInt(entry.progressCount, 10);
        });

        const series = Object.keys(seriesData).map((year) => ({
          name: year,
          data: [
            { name: 'Ready', data: seriesData[year].Ready },
            { name: 'Delivered', data: seriesData[year].Delivered },
            { name: 'InProcess', data: seriesData[year].InProcess },
          ],
        }));

        const chartData = {
          categories,
          series,
        };

        //? NOTES: MySQL Query
        const analytics = await this.repo.manager.query(
          `SELECT 
        SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) AS Ready,
        SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS Delivered,
        SUM(CASE WHEN status = '${OrderStatus.Draft}' THEN 1 ELSE 0 END) AS Draft,
        SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS InProcess,
        COUNT(*) AS Total
      FROM \`order\`
      WHERE applicationId = ${appId};`,
        );

        //? NOTES: MySQL Query
        const readyLastSixMonth = await this.repo.manager.query(
          `SELECT COUNT(id) AS ClaimsPerMonth,
                MONTH(orderDate) AS inMonth,
                YEAR(orderDate) AS inYear
        FROM \`order\`
        WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH) AND status = '${OrderStatus.Ready}' 
        AND applicationId = ${appId}
        GROUP BY YEAR(orderDate), MONTH(orderDate)
        ORDER BY inYear, inMonth;`,
        );

        //? NOTES: MySQL Query
        const draftLastSixMonth = await this.repo.manager.query(
          `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = ?
           AND applicationId = ?
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
          [OrderStatus.Draft, appId],
        );

        //? NOTES: MySQL Query
        const inProcessLastSixMonth = await this.repo.manager.query(
          `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = ?
           AND applicationId = ?
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
          [OrderStatus.InProcess, appId],
        );

        //? NOTES: MySQL Query
        const deliveredLastSixMonth = await this.repo.manager.query(
          `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND status = ?
           AND applicationId = ?
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
          [OrderStatus.Delivered, appId],
        );

        //? NOTES: MySQL Query
        const lastSixMonth = await this.repo.manager.query(
          `SELECT 
            COUNT(id) AS ClaimsPerMonth,
            MONTH(orderDate) AS inMonth,
            YEAR(orderDate) AS inYear
         FROM \`order\`
         WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
           AND applicationId = ?
         GROUP BY YEAR(orderDate), MONTH(orderDate)
         ORDER BY inYear, inMonth;`,
          [appId],
        );

        return {
          analytics: analytics[0],
          lastSixMonth,
          draftLastSixMonth,
          inProcessLastSixMonth,
          readyLastSixMonth,
          deliveredLastSixMonth,
          chartData,
        };
      }

      const queryRes = await this.repo
        .createQueryBuilder('order')
        .select("(strftime('%Y', orderDate))", 'year')
        .addSelect("(strftime('%m', orderDate))", 'month')
        .addSelect(`SUM(CASE WHEN order.status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END)`, 'readyCount')
        .addSelect(`SUM(CASE WHEN order.status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END)`, 'deliveredCount')
        .addSelect(`SUM(CASE WHEN order.status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END)`, 'progressCount')
        .where('order.applicationId = :appId', { appId })
        .groupBy('year')
        .addGroupBy('month')
        .orderBy('year', 'ASC')
        .addOrderBy('month', 'ASC')
        .getRawMany();

      const seriesData: { [year: string]: { Ready: number[]; Delivered: number[]; InProcess: number[] } } = {};

      queryRes.forEach((entry) => {
        const year = entry.year;
        const monthIndex = parseInt(entry.month, 10) - 1;

        if (!seriesData[year]) {
          seriesData[year] = { Ready: Array(12).fill(0), Delivered: Array(12).fill(0), InProcess: Array(12).fill(0) };
        }

        seriesData[year].Ready[monthIndex] = parseInt(entry.readyCount, 10);
        seriesData[year].Delivered[monthIndex] = parseInt(entry.deliveredCount, 10);
        seriesData[year].InProcess[monthIndex] = parseInt(entry.progressCount, 10);
      });

      const series = Object.keys(seriesData).map((year) => ({
        name: year,
        data: [
          { name: 'Ready', data: seriesData[year].Ready },
          { name: 'Delivered', data: seriesData[year].Delivered },
          { name: 'InProcess', data: seriesData[year].InProcess },
        ],
      }));

      const chartData = {
        categories,
        series,
      };

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
        chartData,
      };
    } catch (error) {
      console.log('---> ', error);
    }
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

  async updateNullRefs(appId: number) {
    const allEntities = await this.repo.find({
      where: { application: { id: appId } },
      order: { createTime: 'ASC' },
    });
    let counter = 1;
    for (const entity of allEntities) {
      // If `ref` is null, generate a new value with the prefix 'ORD-' followed by the counter
      if (!entity.ref) {
        entity.ref = `ORD-0${counter}`;
        await this.repo.save(entity);
        counter += 1;
      } else {
        // Parse the current ref number and set the counter to the next number if it’s greater
        const currentNumber = parseInt(entity.ref.split('-')[1], 10);
        if (currentNumber >= counter) {
          counter = currentNumber + 1;
        }
      }
    }
  }
}
