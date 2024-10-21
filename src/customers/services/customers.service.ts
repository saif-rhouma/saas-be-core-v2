/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>,
    @InjectRepository(Order) private repoOrder: Repository<Order>,
    private usersService: UsersService,
    private applicationsService: ApplicationsService,
  ) {}

  async createCustomer(customerData: Partial<Customer>, userId: number, applicationId: number) {
    const customers = await this.repo.find({ where: { email: customerData.email } });
    if (customers.length) {
      // throw Exception !!!
      throw new BadRequestException(MSG_EXCEPTION.OTHER_ALREADY_IN_USE_EMAIL_CUSTOMER);
    }

    const customer = this.repo.create({ ...customerData });
    if (!userId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    customer.createdBy = user;
    customer.application = application;
    return this.repo.save(customer);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const customer = this.repo.findOneBy({ id });
    return customer;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const customer = await this.repo.findOne({
      where: { id, application: { id: appId } },
    });
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }
    const products = await this.topProductsByCustomer(id);
    return { customer, products };
  }

  // findAllByApplication(appId: number) {
  //   return this.repo.find({ where: { application: { id: appId } } });
  // }

  async findAllByApplication(appId: number) {
    const customers = await this.repo.find({ where: { application: { id: appId } } });
    // For each customer, fetch the last 5 orders
    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const LIMIT_ROW = 5;
        const lastFiveOrders = await this.repoOrder.find({
          where: { customer: { id: customer.id } },
          order: { createTime: 'ASC' },
          take: LIMIT_ROW,
          relations: ['productToOrder', 'productToOrder.product'],
        });

        // Return the customer with an added property of their last 5 orders
        return {
          ...customer,
          lastOrders: lastFiveOrders,
        };
      }),
    );

    return customersWithOrders;
  }

  findByName(name: string, appId: number) {
    return this.repo.find({ where: { name, application: { id: appId } } });
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    // const customer = await this.findOne(id);
    const customer = await this.repo.findOne({ where: { id, application: { id: appId } } });
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }
    return this.repo.remove(customer);
  }

  async update(id: number, appId: number, customerData: UpdateCustomerDto) {
    const customer = await this.repo.findOne({ where: { id, application: { id: appId } } });
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }
    Object.assign(customer, customerData);
    return this.repo.save(customer);
  }

  async topFiveCustomers(appId: number) {
    if (!appId) {
      return null;
    }

    const LIMIT_ROW = 5;

    const analytics = await this.repo.manager.query(`
      SELECT c.* , COUNT(o.id) AS total_orders
      FROM customer c 
      LEFT JOIN "order" o ON o.customerId = c.id
      LEFT JOIN application s ON o.applicationId = s.id
      WHERE s.id = ${appId}
      GROUP BY o.customerId
      ORDER by total_orders DESC LIMIT ${LIMIT_ROW}`);

    return analytics;
  }
  async topProductsByCustomer(customerId: number) {
    const products = await this.repo.manager.query(`
      SELECT p.*, 
      SUM(pto.quantity) AS total_quantity
      FROM customer c
      JOIN "order" o ON c.id = o.customerId
      JOIN product_to_order pto ON o.id = pto.orderId
      JOIN product p ON p.id = pto.productId
      WHERE c.id = ${customerId}  
      GROUP BY p.name
      ORDER BY total_quantity DESC;`);
    return products;
  }
}
