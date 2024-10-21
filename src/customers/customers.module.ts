import { Module } from '@nestjs/common';
import { CustomersService } from './services/customers.service';
import { CustomersController } from './controllers/customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/plans/entities/plan.entity';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Customer } from './entities/customer.entity';
import { UsersModule } from 'src/users/users.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { CustomerSubscriber } from './subscribers/customer.subscriber';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  providers: [CustomersService, CustomerSubscriber],
  controllers: [CustomersController],
  imports: [UsersModule, ApplicationsModule, TypeOrmModule.forFeature([Plan, User, Order, Application, Customer])],
  exports: [CustomersService],
})
export class CustomersModule {}
