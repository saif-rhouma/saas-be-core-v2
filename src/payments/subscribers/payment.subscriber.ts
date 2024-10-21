/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { OrdersService } from 'src/orders/services/orders.service';
import { DataSource, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@EventSubscriber()
export class PaymentSubscriber implements EntitySubscriberInterface<Payment> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private ordersService: OrdersService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Payment;
  }

  /**
   * Called after entity update.
   */
  async afterUpdate(event: UpdateEvent<any>) {
    await this.ordersService.updateAmount(event.entity.order);
  }
}
