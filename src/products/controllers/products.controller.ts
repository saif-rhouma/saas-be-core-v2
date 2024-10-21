/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { ProductDto } from '../dtos/product.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductService) {}

  @Serialize(ProductDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createProduct(@Body() productData: CreateProductDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.productsService.create(productData, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  async removeProduct(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.productsService.remove(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findProduct(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const product = await this.productsService.findOneByApplication(parseInt(id), appId);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    return product;
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAllProducts(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.productsService.findAll(appId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    return this.productsService.update(parseInt(id), appId, updateProductDto);
  }
}
