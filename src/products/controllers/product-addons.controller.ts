import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductAddonsService } from '../services/product-addons.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreateProductAddonDto } from '../dtos/create-product-addon.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateProductAddonDto } from '../dtos/update-product-addon.dto';
import { ProductDto } from '../dtos/product.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ProductAddonDto } from '../dtos/product-addon.dto';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('product-addons')
export class ProductAddonsController {
  constructor(private productAddonsService: ProductAddonsService) {}

  @Serialize(ProductAddonDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createProduct(@Body() productAddonData: CreateProductAddonDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.productAddonsService.create(productAddonData, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAllProductAddons(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.productAddonsService.findAllByApplication(appId);
  }

  @Serialize(ProductAddonDto)
  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findProductAddon(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.productAddonsService.findOneByApplication(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeProductAddon(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.productAddonsService.remove(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateProductAddon(
    @Param('id') id: string,
    @Body() productAddonData: UpdateProductAddonDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    const productAddon = await this.productAddonsService.update(parseInt(id), appId, productAddonData);
    return productAddon;
  }
}
