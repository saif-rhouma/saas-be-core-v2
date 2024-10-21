/* eslint-disable prettier/prettier */
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository } from 'typeorm';
import { Plan } from '../entities/plan.entity';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateCodeName } from 'src/common/helpers/generateCodeName';

@EventSubscriber()
export class PlanSubscriber implements EntitySubscriberInterface<Plan> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {
    dataSource.subscribers.push(this);
  }
  listenTo() {
    return Plan;
  }

  /**
   * Called Be entity insert.
   */
  async beforeInsert(event: InsertEvent<Plan>) {
    await generateCodeName(event.entity, this.planRepository, 'PLN');
  }

  // async generatePlanCode(plan: Plan) {
  //   const lastPlan = await this.planRepository.find({
  //     where: { application: { id: plan.application.id } },
  //     order: { id: 'DESC' },
  //     take: 1,
  //   });
  //   let nextNumber = 1;
  //   if (lastPlan.length > 0) {
  //     // Extract the number part from the last `orderCode`
  //     const lastPlanCode = lastPlan[0].ref;
  //     if (lastPlanCode) {
  //       const lastNumber = parseInt(lastPlanCode?.replace('PLN-', ''), 10);
  //       // Increment the number
  //       nextNumber = lastNumber + 1;
  //     }
  //   }
  //   // Assign the new order code
  //   plan.ref = `PLN-${nextNumber}`;
  // }
}
