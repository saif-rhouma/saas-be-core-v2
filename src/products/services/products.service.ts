/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { OrderStatus } from 'src/orders/entities/order.entity';
import { CategoriesService } from './categories.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private applicationsService: ApplicationsService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(productData: CreateProductDto, applicationId: number) {
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    const product = this.repo.create(productData);
    if (productData.categoryId != null) {
      const category = await this.categoriesService.findOneByApplication(productData.categoryId, applicationId);
      product.category = category;
    }
    product.application = application;
    return this.repo.save(product);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const product = this.repo.findOneBy({ id });
    return product;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const product = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: { stock: true, productToOrder: { order: { customer: true } }, application: true, category: true },
    });
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    return product;
  }

  async findByIds(appId: number, ids: number[]) {
    const products = await this.repo
      .createQueryBuilder('product')
      .where('(application.id = :id) AND (product.id IN (:...ids))', {
        id: appId,
        ids: ids,
      })
      .leftJoinAndSelect('product.application', 'application')
      .getMany();
    return products;
  }

  findByName(name: string, appId: number) {
    return this.repo.find({ where: { name, application: { id: appId } } });
  }

  async findAndRemoveCategory(categoryId: number) {
    const products = await this.repo.find({ where: { category: { id: categoryId } } });
    for (const product of products) {
      product.category = null; // Break the relation
      await this.repo.save(product); // Save the updated orders
    }
  }

  // async remove(id: number) {
  //   const product = await this.findOne(id);
  //   if (!product) {
  //     throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
  //   }
  //   return this.repo.remove(product);
  // }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const product = await this.findOneByApplication(id, appId);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    return this.repo.remove(product);
  }

  // findAll(appId: number) {
  //   return this.repo.find({
  //     where: { application: { id: appId } },
  //     relations: { stock: true, productToOrder: { order: true }, application: true },
  //   });
  // }

  async findAll(appId: number) {
    const products = await this.repo.find({
      where: { application: { id: appId } },
      relations: { stock: true, productToOrder: { order: { customer: true } }, application: true, category: true },
      order: { productToOrder: { order: { orderDate: 'ASC' } } },
    });
    products.forEach((prod) => {
      const filtered = prod.productToOrder.filter((item) => item?.order?.status !== OrderStatus.Draft);
      prod.productToOrder = filtered.slice(0, 6);
    });
    return products;
  }

  findAllStock(appId: number) {
    return this.repo.find({ where: { application: { id: appId } }, relations: { stock: true } });
  }

  async update(id: number, appId: number, prod: UpdateProductDto) {
    const product = await this.findOneByApplication(id, appId);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    Object.assign(product, prod);
    if (prod.categoryId != null && prod.categoryId !== product?.category?.id) {
      const category = await this.categoriesService.findOneByApplication(prod.categoryId, appId);
      product.category = category;
    }
    return this.repo.save(product);
  }

  async topFiveProducts(appId: number) {
    if (!appId) {
      return null;
    }

    const LIMIT_ROW = 5;

    const analytics = await this.repo.manager.query(`
      SELECT p.*, SUM(op.quantity) AS total_quantity
      FROM product p
      LEFT JOIN product_to_order op ON p.id = op.productId 
      LEFT JOIN "order" o ON op.orderId = o.id
      LEFT JOIN application s ON o.applicationId = s.id
      WHERE s.id = ${appId}
      GROUP BY p.id, p.name 
      ORDER BY total_quantity DESC
      LIMIT ${LIMIT_ROW};`);

    return analytics;
  }
}
