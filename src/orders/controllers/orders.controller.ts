/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import getApplicationId from 'src/common/helpers/application-id.func';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderDto } from '../dtos/order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrdersService } from '../services/orders.service';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RoleType } from 'src/common/constants/roles';
// import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { OrderStatus } from '../entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Serialize(OrderDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createOrder(@Body() orderData: CreateOrderDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.ordersService.createOrder(orderData, user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const orders = await this.ordersService.findAllByApplication(appId);
    return orders;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/tools/refs')
  async updateAllNullOrderRef(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const orders = await this.ordersService.updateNullRefs(appId);
    return orders;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/approve/:id')
  async approve(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const order = await this.ordersService.detailsApprove(id, appId);
    const outOfStock = [];
    const { productToOrder } = order;
    for (const ordProd of productToOrder) {
      const stockQuantity = ordProd.product.stock?.quantity || 0;
      if (ordProd.quantity > stockQuantity) {
        const data = {
          orderId: order.id,
          product: ordProd.product,
          missingQuantity: stockQuantity - ordProd.quantity,
        };
        outOfStock.push(data);
      }
    }
    if (outOfStock.length === 0) {
      const order = await this.ordersService.update(id, appId, { status: OrderStatus.InProcess });
      return order;
    } else {
      return outOfStock;
    }
  }

  @UseGuards(AuthenticationGuard)
  @Post('/approve/plans/')
  async approveConfirm(@Body() payload: any, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const order = await this.ordersService.approveAndCreatePlans(payload, user.id, appId);
    return order;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/analytics')
  async ordersAnalytics(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const analytics = await this.ordersService.analytics(appId);
    return analytics;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findOrder(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const order = await this.ordersService.findOneByApplication(id, appId);
    return order;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateOrder(@Param('id') id: string, @Body() orderData: UpdateOrderDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const order = await this.ordersService.update(id, appId, orderData);
    return order;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeOrder(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.ordersService.remove(id, appId);
  }
}
