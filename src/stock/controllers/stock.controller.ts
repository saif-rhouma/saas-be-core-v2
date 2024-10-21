/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import getApplicationId from 'src/common/helpers/application-id.func';
import { ProductService } from 'src/products/services/products.service';
import { User } from 'src/users/entities/user.entity';
import { StockService } from '../services/stock.service';
import { PlansService } from 'src/plans/services/plans.service';
import { CreateStockDto } from '../dtos/create-stock.dto';
import { UpdateStockDto } from '../dtos/update-stock.dto';

@Controller('stock')
export class StockController {
  constructor(
    private stocksService: StockService,
    private productsService: ProductService,
    @Inject(forwardRef(() => PlansService))
    private plansService: PlansService,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createStock(@Body() stockData: CreateStockDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.stocksService.createStock(stockData, appId);
    return 'OK';
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  async removeStock(@Param('id') id: string) {
    return this.stocksService.remove(parseInt(id));
  }

  @UseGuards(AuthenticationGuard)
  @Get('/')
  async findAllProducts(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const products = await this.productsService.findAllStock(appId);
    if (products.length) {
      const stocksWithNamesInStock = products
        .filter((product) => product.stock !== null)
        .map((product) => ({
          ...product.stock,
          name: product.name,
          image: product.image,
          productId: product.id,
        }));
      return stocksWithNamesInStock;
    }
    return [];
  }

  @UseGuards(AuthenticationGuard)
  @Get('/details')
  async stockDetails(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);

    const products = await this.productsService.findAllStock(appId);
    const plansStock = await this.plansService.getStockPlan(appId);

    if (products?.length && plansStock?.length) {
      plansStock.forEach((ps, idx) => {
        const product = products.find((prod) => prod.id === ps.productId);
        if (product) {
          plansStock[idx].in_stock = product?.stock?.quantity || 0;
        }
      });
    }
    return plansStock;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findProduct(@Param('id') id: string) {
    const product = await this.stocksService.findOne(parseInt(id));
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    return product;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateProduct(@Param('id') id: string, @GetUser() user: Partial<User>, @Body() updateStockDto: UpdateStockDto) {
    const appId = getApplicationId(user);
    return this.stocksService.update(parseInt(id), appId, updateStockDto);
  }
}
