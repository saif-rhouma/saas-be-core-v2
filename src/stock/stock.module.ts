import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { StockController } from './controllers/stock.controller';
import { Stock } from './entities/stock.entity';
import { Supplying } from './entities/supplying.entity';
import { StockService } from './services/stock.service';
import { SupplyingService } from './services/supplying.service';
import { PlansModule } from 'src/plans/plans.module';

@Module({
  controllers: [StockController],
  providers: [StockService, SupplyingService],
  imports: [ProductsModule, forwardRef(() => PlansModule), TypeOrmModule.forFeature([Stock, Supplying])],
  exports: [StockService, SupplyingService],
})
export class StockModule {}
