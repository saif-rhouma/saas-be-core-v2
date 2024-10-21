import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  controllers: [AnalyticsController],
  imports: [OrdersModule, ProductsModule, CustomersModule],
})
export class AnalyticsModule {}
