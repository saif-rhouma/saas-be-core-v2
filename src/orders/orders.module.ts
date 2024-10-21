/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/plans/entities/plan.entity';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Product } from 'src/products/entities/product.entity';
import { Order } from './entities/order.entity';
import { ProductToOrder } from './entities/product_order.entity';
import { CustomersModule } from 'src/customers/customers.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { ProductOrderService } from './services/product-order.service';
import { OrdersStatusController } from './controllers/orders-status.controller';
import { StockModule } from 'src/stock/stock.module';
import { PlansModule } from 'src/plans/plans.module';
import { OrderSubscriber } from './subscribers/order.subscriber';

@Module({
  controllers: [OrdersController, OrdersStatusController],
  providers: [OrdersService, ProductOrderService, OrderSubscriber],
  imports: [
    UsersModule,
    CustomersModule,
    ProductsModule,
    ApplicationsModule,
    PlansModule,
    StockModule,
    TypeOrmModule.forFeature([Plan, User, Application, Customer, Product, Order, ProductToOrder]),
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
