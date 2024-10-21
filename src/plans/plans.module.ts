/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { PlansController } from './controllers/plans.controller';
import { PlansService } from './services/plans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';
import { ApplicationsModule } from 'src/applications/applications.module';
import { PlansStatusController } from './controllers/plans-status.controller';
import { StockModule } from 'src/stock/stock.module';
import { PlanSubscriber } from './subscribers/plan.subscriber';

@Module({
  controllers: [PlansController, PlansStatusController],
  providers: [PlansService, PlanSubscriber],
  imports: [
    UsersModule,
    ApplicationsModule,
    ProductsModule,
    forwardRef(() => StockModule),
    TypeOrmModule.forFeature([Plan, User, Application]),
  ],
  exports: [PlansService],
})
export class PlansModule {}
