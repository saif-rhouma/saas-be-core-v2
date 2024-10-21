/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { ApplicationsService } from './services/applications.service';
import { User } from 'src/users/entities/user.entity';
import { Application } from './entities/application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './controllers/applications.controller';
import { UsersModule } from 'src/users/users.module';
import { Customer } from 'src/customers/entities/customer.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductAddon } from 'src/products/entities/product-addon.entity';
import { FinancialModule } from 'src/financial/financial.module';
import { Category } from 'src/products/entities/category.entity';
@Module({
  controllers: [ApplicationsController],
  imports: [
    forwardRef(() => FinancialModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User, Application, Customer, Plan, Product, ProductAddon, Category]),
  ],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
