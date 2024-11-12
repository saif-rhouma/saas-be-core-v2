import { forwardRef, Module } from '@nestjs/common';
import { QuotationsController } from './controllers/quotations.controller';
import { QuotationsService } from './services/quotations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Product } from 'src/products/entities/product.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProductToQuotation } from './entities/product_quotation.entity';
import { Quotation } from './entities/quotation.entity';
import { UsersModule } from 'src/users/users.module';
import { CustomersModule } from 'src/customers/customers.module';
import { ProductsModule } from 'src/products/products.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { OrdersModule } from 'src/orders/orders.module';
import { QuotationSubscriber } from './subscribers/quotation.subscriber';
import { ProductQuotationService } from './services/product-quotation.service';
import { FilesModule } from 'src/files/files.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [QuotationsController],
  providers: [QuotationsService, QuotationSubscriber, ProductQuotationService],
  imports: [
    UsersModule,
    CustomersModule,
    ProductsModule,
    ApplicationsModule,
    OrdersModule,
    TypeOrmModule.forFeature([User, Application, Customer, Product, Order, ProductToQuotation, Quotation]),
    FilesModule,
    forwardRef(() => NotificationsModule),
  ],
  exports: [QuotationsService],
})
export class QuotationsModule {}
