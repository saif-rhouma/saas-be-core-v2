/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Quotation, QuotationStatus } from '../entities/quotation.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { CustomersService } from 'src/customers/services/customers.service';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { ProductQuotationService } from './product-quotation.service';
import { ProductService } from 'src/products/services/products.service';
import { CreateQuotationDto } from '../dtos/create-quotation.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateQuotationDto } from '../dtos/update-quotation.dto';
import { OrdersService } from 'src/orders/services/orders.service';
import { CreateOrderDto, ProductQty } from 'src/orders/dtos/create-order.dto';
import { RoleType } from 'src/common/constants/roles';
import { PermissionType } from 'src/common/constants/permissions';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation) private repo: Repository<Quotation>,
    private usersService: UsersService,
    private customersService: CustomersService,
    private applicationsService: ApplicationsService,
    private productQuotationService: ProductQuotationService,
    private ordersService: OrdersService,
    private productsService: ProductService,
  ) {}

  async createQuotation(quotationData: CreateQuotationDto, userId: number, applicationId: number) {
    if (!userId || !applicationId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const customer = await this.customersService.findOne(quotationData.customer);
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }

    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    const productsIds = quotationData.products.map((product) => product.id);

    const products = await this.productsService.findByIds(applicationId, productsIds);
    if (!products) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    let totalAmount = 0;

    products.forEach((prod) => {
      const prd = quotationData.products.find((prd) => prd.id === prod.id);
      const price = prd?.snapshotProductPrice || prod.price;
      if (prd) {
        totalAmount += price * prd.quantity;
      }
    });

    const quotation = new Quotation();

    quotation.quotationDate = quotationData.quotationDate;
    quotation.application = application;
    quotation.createdBy = user;
    quotation.customer = customer;
    quotation.discount = quotationData.discount;
    quotation.name = quotationData.name;
    quotation.totalAmount = totalAmount;

    const preQuotation = this.repo.create({ ...quotation });
    const resQuotation = await this.repo.save(preQuotation);

    await this.productQuotationService.assignProductToOrder(preQuotation, quotationData.products, products);

    return resQuotation;
  }

  async updateQuotation(id: string, appId: number, attrs: Partial<UpdateQuotationDto>) {
    const quotation = await this.findOneByApplication(id, appId);

    if (!quotation) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_QUOTATION);
    }

    const customer = await this.customersService.findOne(attrs.customer);
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }

    const productsIds = attrs.products.map((product) => product.id);

    const prodToQuoIds = quotation.productToQuotation.map((item) => item.id);
    await this.productQuotationService.removeAllByIds(prodToQuoIds);

    const products = await this.productsService.findByIds(appId, productsIds);
    if (!products) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }

    let totalAmount = 0;

    products.forEach((prod) => {
      const prd = attrs.products.find((prd) => prd.id === prod.id);
      const price = prd?.snapshotProductPrice || prod.price;
      if (prd) {
        totalAmount += price * prd.quantity;
      }
    });

    quotation.quotationDate = attrs.quotationDate;
    quotation.customer = customer;
    quotation.discount = attrs.discount;
    quotation.name = attrs.name;
    quotation.totalAmount = totalAmount;

    this.productQuotationService.assignProductToQuotation(quotation, attrs.products, products);

    const resQuotation = await this.repo.save(quotation);

    return resQuotation;
  }

  async findAllByApplication(appId: number) {
    if (!appId || isNaN(appId)) {
      return null;
    }
    // const quotations = this.repo.find({
    //   where: { application: { id: appId } },
    //   relations: ['productToQuotation', 'productToQuotation.product', 'customer', 'order', 'createdBy'],
    //   order: { quotationDate: 'ASC' },
    // });

    const quotations = await this.repo
      .createQueryBuilder('quotation')
      .leftJoinAndSelect('quotation.createdBy', 'user')
      .leftJoinAndSelect('quotation.productToQuotation', 'productToQuotation')
      .leftJoinAndSelect('productToQuotation.product', 'product')
      .leftJoinAndSelect('quotation.order', 'order')
      .leftJoinAndSelect('quotation.customer', 'customer')
      .where('quotation.applicationId = :appId', { appId })
      .orderBy('CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED)', 'ASC')
      .getMany();

    if (!quotations) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_QUOTATION);
    }
    return quotations;
  }

  async findAllByApplicationAdvance(userId: number, appId: number) {
    if (!appId || isNaN(appId)) {
      return null;
    }

    const user = await this.usersService.getDetails(userId);

    if (user.roles.map((role) => role.name).includes(RoleType.STAFF)) {
      // TODO PermissionType.LIST_ORDER SHOULD BE CHANGED !!!
      if (!user.permissions.map((permission) => permission.slug).includes(PermissionType.GROUP_QUOTATION_LIST)) {
        const quotations = await this.repo
          .createQueryBuilder('quotation')
          .leftJoinAndSelect('quotation.createdBy', 'user')
          .leftJoinAndSelect('quotation.productToQuotation', 'productToQuotation')
          .leftJoinAndSelect('productToQuotation.product', 'product')
          .leftJoinAndSelect('quotation.order', 'order')
          .leftJoinAndSelect('quotation.customer', 'customer')
          .where('quotation.applicationId = :appId', { appId })
          .andWhere('quotation.createdBy = :userId', { userId })
          .orderBy('CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED)', 'ASC')
          .getMany();
        if (!quotations) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_QUOTATION);
        }
        return quotations;
      }
    }

    const quotations = await this.repo
      .createQueryBuilder('quotation')
      .leftJoinAndSelect('quotation.createdBy', 'user')
      .leftJoinAndSelect('quotation.productToQuotation', 'productToQuotation')
      .leftJoinAndSelect('productToQuotation.product', 'product')
      .leftJoinAndSelect('quotation.order', 'order')
      .leftJoinAndSelect('quotation.customer', 'customer')
      .where('quotation.applicationId = :appId', { appId })
      .orderBy('CAST(SUBSTRING(quotation.ref, 4, LENGTH(quotation.ref)) AS UNSIGNED)', 'ASC')
      .getMany();

    if (!quotations) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_QUOTATION);
    }
    return quotations;
  }

  findAllActiveByApplication(appId: number) {
    if (!appId || isNaN(appId)) {
      return null;
    }
    const quotations = this.repo.find({
      where: { status: Not(QuotationStatus.Created), application: { id: appId } },
      relations: {
        application: true,
        productToQuotation: {
          product: true,
        },
        customer: true,
        order: true,
      },
    });
    if (!quotations) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_QUOTATION);
    }
    return quotations;
  }

  async findOneByApplication(id: string, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const quotation = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: {
        application: true,
        productToQuotation: {
          product: true,
        },
        customer: true,
        reminders: true,
        tickets: true,
        order: true,
      },
    });
    if (!quotation) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_QUOTATION);
    }
    return quotation;
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    const quotation = this.repo.findOneBy({ id });
    return quotation;
  }

  async update(id: string, appId: number, attrs: Partial<UpdateQuotationDto>) {
    const quotation = await this.findOneByApplication(id, appId);
    Object.assign(quotation, attrs);
    return this.repo.save(quotation);
  }

  async approveAndCreateOrder(quotationId: string, userId: number, appId: number) {
    const quotation = await this.findOneByApplication(quotationId, appId);
    if (quotation && !quotation.order) {
      const order = new CreateOrderDto();

      const productQty: ProductQty[] = [];

      for (const prQuo of quotation.productToQuotation) {
        const item = {
          id: prQuo.productId,
          snapshotProductPrice: prQuo.snapshotProductPrice,
          quantity: prQuo.quantity,
        };
        productQty.push(item);
      }

      order.orderDate = new Date();
      order.discount = quotation.discount;
      order.customer = quotation.customer.id;
      order.products = productQty;

      const orderRes = await this.ordersService.createOrder(order, userId, appId);
      return this.update(quotationId, appId, { status: QuotationStatus.Confirmed, order: orderRes });
    }
  }

  async remove(id: string, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const order = await this.findOneByApplication(id, appId);
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return this.update(id, appId, { status: QuotationStatus.Canceled });
  }
}
