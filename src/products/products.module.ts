/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ApplicationsModule } from 'src/applications/applications.module';
import { Application } from 'src/applications/entities/application.entity';
import { ProductAddonsService } from './services/product-addons.service';
import { ProductAddonsController } from './controllers/product-addons.controller';
import { ProductAddon } from './entities/product-addon.entity';
import { Category } from './entities/category.entity';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';

@Module({
  controllers: [ProductsController, ProductAddonsController, CategoriesController],
  providers: [ProductService, ProductAddonsService, CategoriesService],
  imports: [ApplicationsModule, TypeOrmModule.forFeature([Product, ProductAddon, Application, Category])],
  exports: [ProductService, ProductAddonsService, CategoriesService],
})
export class ProductsModule {}
