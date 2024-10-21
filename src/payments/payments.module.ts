import { Module } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { UsersModule } from 'src/users/users.module';
import { CustomersModule } from 'src/customers/customers.module';
import { ProductsModule } from 'src/products/products.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/plans/entities/plan.entity';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Product } from 'src/products/entities/product.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from './entities/payment.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { PaymentSubscriber } from './subscribers/payment.subscriber';

@Module({
  providers: [PaymentsService, PaymentSubscriber],
  controllers: [PaymentsController],
  imports: [
    UsersModule,
    CustomersModule,
    ProductsModule,
    OrdersModule,
    ApplicationsModule,
    TypeOrmModule.forFeature([Plan, User, Application, Customer, Product, Order, Payment]),
  ],
})
export class PaymentsModule {}
