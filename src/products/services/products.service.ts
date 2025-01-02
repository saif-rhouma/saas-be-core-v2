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
import { DATABASE_TYPE } from 'src/common/constants/global';
import { ConfigService } from '@nestjs/config';
import { PRODUCT_QUERIES } from './query.string';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private applicationsService: ApplicationsService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    private readonly config: ConfigService,
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

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const product = await this.findOneByApplication(id, appId);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    Object.assign(product, { isHidden: true });

    return this.repo.save(product);
  }

  async findAll(appId: number) {
    if (this.config.get('databaseType') === DATABASE_TYPE.POSTGRESQL) {
      const products = await this.repo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.stock', 'stock')
        .leftJoinAndSelect('product.productToOrder', 'productToOrder')
        .leftJoinAndSelect('productToOrder.order', 'order')
        .leftJoinAndSelect('order.customer', 'customer')
        .leftJoinAndSelect('product.application', 'application')
        .leftJoinAndSelect('product.category', 'category')
        .where('application.id = :appId', { appId })
        .andWhere('product.isHidden = :isHidden', { isHidden: false })
        .orderBy('product.id', 'DESC')
        .addOrderBy(
          `
    CAST(
      REGEXP_REPLACE(order.ref, '\\D', '', 'g') AS INTEGER
    )
  `,
          'ASC',
        ) // Extract numeric part for sorting
        .getMany();
      products.forEach((prod) => {
        const filtered = prod.productToOrder.filter((item) => item?.order?.status !== OrderStatus.Draft);
        prod.productToOrder = filtered.slice(0, 6);
      });
      return products;
    }

    const products = await this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.stock', 'stock')
      .leftJoinAndSelect('product.productToOrder', 'productToOrder')
      .leftJoinAndSelect('productToOrder.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('product.application', 'application')
      .leftJoinAndSelect('product.category', 'category')
      .where('application.id = :appId', { appId })
      .andWhere('product.isHidden = :isHidden', { isHidden: false })
      .orderBy('product.id', 'DESC')
      .addOrderBy('CAST(SUBSTRING(order.ref, 4) AS UNSIGNED)', 'ASC') // Extract numeric part for sorting
      .getMany();

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

  async topProducts(appId: number) {
    if (!appId) {
      return null;
    }

    const queryString = PRODUCT_QUERIES.topProducts[this.config.get('databaseType')](appId);
    const analytics = await this.repo.manager.query(queryString);
    return analytics;
  }

  async topFiveProducts(appId: number) {
    if (!appId) {
      return null;
    }

    const LIMIT_ROW = 5;

    const queryString = PRODUCT_QUERIES.topFiveProducts[this.config.get('databaseType')](appId, LIMIT_ROW);
    const analytics = await this.repo.manager.query(queryString);
    return analytics;
  }
}
