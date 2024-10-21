/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UsersService } from 'src/users/services/users.service';
import { CustomersService } from 'src/customers/services/customers.service';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { OrdersService } from 'src/orders/services/orders.service';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private repo: Repository<Payment>,
    private usersService: UsersService,
    private customersService: CustomersService,
    private ordersService: OrdersService,
    private applicationsService: ApplicationsService,
  ) {}

  async createPayment(paymentData: Partial<CreatePaymentDto>, userId: number, applicationId: number) {
    const prePayment = new Payment();
    prePayment.paymentDate = paymentData.paymentDate;
    prePayment.amount = paymentData.amount;
    prePayment.notes = paymentData?.notes;
    prePayment.paymentType = paymentData.paymentType;
    prePayment.attachments = paymentData.attachments;

    const payment = this.repo.create({ ...prePayment });
    if (!userId || !paymentData.orderId || !applicationId || !paymentData.customerId) {
      return null;
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const customer = await this.customersService.findOne(paymentData.customerId);
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }

    const order = await this.ordersService.findOne(paymentData.orderId);
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }

    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    payment.createdBy = user;
    payment.customer = customer;
    payment.application = application;
    payment.order = order;

    const resPayment = await this.repo.save(payment);
    await this.ordersService.addAmount(order, paymentData.amount);
    return resPayment;
  }

  findAllByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const payments = this.repo.find({
      where: { application: { id: appId } },
      relations: { order: true, customer: true },
    });
    if (!payments) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PAYMENT);
    }
    return payments;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const payment = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: { order: true, customer: true },
    });
    if (!payment) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PAYMENT);
    }
    return payment;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const payment = this.repo.findOneBy({ id });
    return payment;
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const payment = await this.findOneByApplication(id, appId);
    if (!payment) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PAYMENT);
    }
    await this.ordersService.subAmount(payment.order, payment.amount);
    return this.repo.remove(payment);
  }

  async update(id: number, appId: number, attrs: Partial<UpdatePaymentDto>) {
    const payment = await this.findOneByApplication(id, appId);
    Object.assign(payment, attrs);
    return this.repo.save(payment);
  }
}
