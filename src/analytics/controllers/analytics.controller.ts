import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import getApplicationId from 'src/common/helpers/application-id.func';
import { CustomersService } from 'src/customers/services/customers.service';
import { OrdersService } from 'src/orders/services/orders.service';
import { ProductService } from 'src/products/services/products.service';
import { User } from 'src/users/entities/user.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private ordersService: OrdersService,
    private productsService: ProductService,
    private customersService: CustomersService,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const orders = await this.ordersService.analyticsAdvance(appId);
    const products = await this.productsService.topFiveProducts(appId);
    const customers = await this.customersService.topFiveCustomers(appId);

    return { orders, products, customers };
  }
}
