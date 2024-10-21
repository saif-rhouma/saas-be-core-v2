/* eslint-disable prettier/prettier */
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateCodeName } from 'src/common/helpers/generateCodeName';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    dataSource.subscribers.push(this);
  }
  listenTo() {
    return Order;
  }

  /**
   * Called Be entity insert.
   */
  async beforeInsert(event: InsertEvent<Order>) {
    // await this.generateOrderCode(event.entity);
    await generateCodeName(event.entity, this.orderRepository, 'ORD');
    event.entity.snapshotTaxPercentage = event.entity.application.taxPercentage;
  }
}
