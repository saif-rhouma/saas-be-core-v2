/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './products/products.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Permission } from './users/entities/permission.entity';
import { Role } from './users/entities/role.entity';
import { RefreshToken } from './auth/entities/token.entity';
import { Product } from './products/entities/product.entity';

import { ApplicationsModule } from './applications/applications.module';
import { Application } from './applications/entities/application.entity';
import { PlansModule } from './plans/plans.module';
import { Plan } from './plans/entities/plan.entity';
import { CustomersModule } from './customers/customers.module';
import { Customer } from './customers/entities/customer.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { ProductToOrder } from './orders/entities/product_order.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { TicketsModule } from './tickets/tickets.module';
import { Ticket } from './tickets/entities/ticket.entity';
import { TicketMessage } from './tickets/entities/ticket-message.entity';
import { StockModule } from './stock/stock.module';
import { Stock } from './stock/entities/stock.entity';
import { Supplying } from './stock/entities/supplying.entity';
import { FilesModule } from './files/files.module';
import { File } from './files/entities/file.entity';
import { RemindersModule } from './reminders/reminders.module';
import { Reminder } from './reminders/entities/reminder.entity';
import { ProductAddon } from './products/entities/product-addon.entity';
import { FinancialModule } from './financial/financial.module';
import { Financial } from './financial/entities/financial-year.entity';
import { AnalyticsModule } from './analytics/analytics.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { SeedersModule } from './seeders/seeders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Category } from './products/entities/category.entity';
import { PermissionsGroup } from './users/entities/permissions-group.entity';
import { QuotationsModule } from './quotations/quotations.module';
import { Quotation } from './quotations/entities/quotation.entity';
import { ProductToQuotation } from './quotations/entities/product_quotation.entity';
import configuration from './common/configs/config';
import { DATABASE_TYPE } from './common/constants/global';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: join(__dirname, './../log/debug/'),
          filename: 'debug.log',
          level: 'debug',
        }),
        new winston.transports.File({
          dirname: join(__dirname, './../log/error/'),
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          dirname: join(__dirname, './../log/info/'),
          filename: 'info.log',
          level: 'info',
        }),
      ],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('auth.accessToken'),
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (config.get('databaseType') === DATABASE_TYPE.MYSQL) {
          return {
            type: 'mysql',
            host: config.get('database.host'),
            port: config.get('database.port'),
            username: config.get('database.username'),
            password: config.get('database.password'),
            database: config.get<string>('database.dbName'),
            synchronize: true,
            // logging: ['query', 'error'],
            entities: [
              User,
              RefreshToken,
              Permission,
              Role,
              Product,
              Application,
              Plan,
              Customer,
              Order,
              ProductToOrder,
              Payment,
              Ticket,
              TicketMessage,
              Stock,
              Supplying,
              File,
              Reminder,
              ProductAddon,
              Financial,
              Category,
              PermissionsGroup,
              Quotation,
              ProductToQuotation,
            ],
          };
        }
        //! NOTES : THIS CONFIGS IS ONLY FOR LOCAL DEV SETUP
        return {
          type: 'sqlite',
          database: 'db.dev.sqlite',
          synchronize: true,
          logging: ['query', 'error'],
          entities: [
            User,
            RefreshToken,
            Permission,
            Role,
            Product,
            Application,
            Plan,
            Customer,
            Order,
            ProductToOrder,
            Payment,
            Ticket,
            TicketMessage,
            Stock,
            Supplying,
            File,
            Reminder,
            ProductAddon,
            Financial,
            Category,
            PermissionsGroup,
            Quotation,
            ProductToQuotation,
          ],
        };
      },
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    ApplicationsModule,
    PlansModule,
    CustomersModule,
    OrdersModule,
    PaymentsModule,
    TicketsModule,
    StockModule,
    FilesModule,
    RemindersModule,
    FinancialModule,
    AnalyticsModule,
    SeedersModule,
    NotificationsModule,
    QuotationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
