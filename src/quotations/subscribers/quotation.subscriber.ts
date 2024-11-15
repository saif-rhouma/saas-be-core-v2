/* eslint-disable prettier/prettier */
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateCodeName } from 'src/common/helpers/generateCodeName';
import { Quotation } from '../entities/quotation.entity';
import { randomUUID } from 'crypto';

@EventSubscriber()
export class QuotationSubscriber implements EntitySubscriberInterface<Quotation> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Quotation;
  }

  /**
   * Called Be entity insert.
   */
  async beforeInsert(event: InsertEvent<Quotation>) {
    await generateCodeName(event.entity, this.quotationRepository, 'QTT');
    if (!event.entity.name) {
      // event.entity.name = `${event.entity.ref} : Quotation For Client ${event.entity.customer.name}`;
      event.entity.name = `${event.entity.ref}`;
    }
    event.entity.snapshotTaxPercentage = event.entity.application.taxPercentage;
    event.entity.id = randomUUID();
  }
}
