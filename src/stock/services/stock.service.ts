/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from 'src/products/services/products.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { CreateStockDto } from '../dtos/create-stock.dto';
import { Stock } from '../entities/stock.entity';
import { Product } from 'src/products/entities/product.entity';
import { UpdateStockDto } from '../dtos/update-stock.dto';
import { Order } from 'src/orders/entities/order.entity';

export enum Operation {
  ADD = 'ADD',
  SUB = 'SUB',
}
@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock) private repo: Repository<Stock>,
    private productsService: ProductService,
  ) {}

  async createStock(stockData: CreateStockDto, appId: number) {
    if (!appId) {
      return null;
    }
    const product = await this.productsService.findOneByApplication(stockData.product, appId);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }

    const stock = await this.findOneByProduct(stockData.product, appId);

    if (stock) {
      stock.quantity = stockData.quantity;
      return this.repo.save(stock);
    } else {
      const newStock = this.repo.create({ quantity: stockData.quantity });
      newStock.product = product;
      return this.repo.save(newStock);
    }
  }

  async createFromPlan(quantity: number, product: Product, appId: number) {
    const { id } = product;
    const stock = await this.findOneByProduct(id, appId);
    if (stock) {
      stock.quantity += quantity;
      return this.repo.save(stock);
    } else {
      const newStock = this.repo.create({ quantity });
      newStock.product = product;
      return this.repo.save(newStock);
    }
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const stock = this.repo.findOneBy({ id });
    return stock;
  }

  async remove(id: number) {
    if (!id) {
      return null;
    }

    const stock = await this.findOne(id);
    if (!stock) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_STOCK);
    }
    return this.repo.remove(stock);
  }

  async findOneByProduct(productId: number, appId: number) {
    if (!productId) {
      return null;
    }
    const stock = await this.repo.findOne({ where: { product: { id: productId, application: { id: appId } } } });
    return stock;
  }

  async updateQuantity(productId: number, quantity: number, appId: number) {
    const stock = await this.findOneByProduct(productId, appId);
    if (!stock) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_STOCK);
    }
    stock.quantity = quantity;
    return this.repo.save(stock);
  }

  async update(id: number, appId: number, stockData: UpdateStockDto) {
    const stock = await this.repo.findOne({ where: { id, product: { application: { id: appId } } } });
    if (!stock) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_STOCK);
    }
    Object.assign(stock, stockData);
    return this.repo.save(stock);
  }

  async updateFromOrder(order: Order, appId: number, operation: Operation = Operation.SUB) {
    const { productToOrder } = order;
    for (const product of productToOrder) {
      const stock = await this.findOneByProduct(product.productId, appId);
      if (stock?.quantity !== undefined) {
        if (operation === Operation.SUB) {
          stock.quantity -= product.quantity;
          order.subProductStock = true;
        } else {
          stock.quantity += product.quantity;
          order.subProductStock = false;
        }
        await this.repo.save(stock);
      } else {
        const newStock = this.repo.create({ quantity: 0 });

        newStock.product = product.product;

        if (operation === Operation.SUB) {
          newStock.quantity -= product.quantity;
          order.subProductStock = true;
        } else {
          newStock.quantity += product.quantity;
          order.subProductStock = false;
        }
        await this.repo.save(newStock);
      }
    }

    return order;
  }
}
