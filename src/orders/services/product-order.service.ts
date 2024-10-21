/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProductToOrder } from '../entities/product_order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class ProductOrderService {
  constructor(@InjectRepository(ProductToOrder) private repo: Repository<ProductToOrder>) {}

  async assignProductToOrder(order: Order, productsData: any[], products: Product[]) {
    for (const element of productsData) {
      const productToOrder = new ProductToOrder();

      const product = products.find((prod) => prod.id === element.id);

      productToOrder.order = order;
      productToOrder.product = product;
      productToOrder.orderId = order.id;
      productToOrder.productId = product.id;
      productToOrder.quantity = element.quantity;
      productToOrder.snapshotProductPrice = element.snapshotProductPrice;

      const prodToOrder = this.repo.create(productToOrder);
      await this.repo.save(prodToOrder);
    }
  }

  async remove(oderId: number) {
    if (!oderId) {
      return null;
    }
    const res = await this.repo
      .createQueryBuilder()
      .delete()
      .from(ProductToOrder)
      .where('orderId = :id', {
        id: oderId,
      })
      .execute();
    return res;
  }
}
