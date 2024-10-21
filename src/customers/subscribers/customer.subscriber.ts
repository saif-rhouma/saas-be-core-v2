/* eslint-disable prettier/prettier */
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateCodeName } from 'src/common/helpers/generateCodeName';

@EventSubscriber()
export class CustomerSubscriber implements EntitySubscriberInterface<Customer> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {
    dataSource.subscribers.push(this);
  }
  listenTo() {
    return Customer;
  }

  /**
   * Called Be entity insert.
   */
  async beforeInsert(event: InsertEvent<Customer>) {
    await generateCodeName(event.entity, this.customerRepository, 'CUS');
    // await this.generateCustomerCode(event.entity);
  }

  // async generateCustomerCode(customer: Customer) {
  //   const lastPlan = await this.customerRepository.find({
  //     where: { application: { id: customer.application.id } },
  //     order: { id: 'DESC' },
  //     take: 1,
  //   });
  //   let nextNumber = 1;
  //   if (lastPlan.length > 0) {
  //     // Extract the number part from the last `orderCode`
  //     const lastCustomerCode = lastPlan[0].ref;
  //     if (lastCustomerCode) {
  //       const lastNumber = parseInt(lastCustomerCode?.replace('CUS-', ''), 10);
  //       // Increment the number
  //       nextNumber = lastNumber + 1;
  //     }
  //   }
  //   // Assign the new order code
  //   customer.ref = `PLN-${nextNumber}`;
  // }
}
