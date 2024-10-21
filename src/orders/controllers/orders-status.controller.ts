/* eslint-disable prettier/prettier */
import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import getApplicationId from 'src/common/helpers/application-id.func';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { COLUMNS_ORDERS_STATUS } from 'src/common/constants/kanban-configs';
import { OrderStatus } from '../entities/order.entity';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';

@Controller('orders-status')
export class OrdersStatusController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const orders = await this.ordersService.findAllActiveByApplication(appId);
    if (!orders) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    const response = { board: { columns: COLUMNS_ORDERS_STATUS, tasks: {} } };
    const tasks = {};

    COLUMNS_ORDERS_STATUS.forEach((col) => {
      tasks[col.id] = [];
    });

    orders.forEach((order) => {
      if (order.status === OrderStatus.InProcess) {
        tasks[COLUMNS_ORDERS_STATUS[0].id].push(order);
      }
      if (order.status === OrderStatus.Ready) {
        tasks[COLUMNS_ORDERS_STATUS[1].id].push(order);
      }
      if (order.status === OrderStatus.Delivered) {
        tasks[COLUMNS_ORDERS_STATUS[2].id].push(order);
      }
    });

    response.board.tasks = tasks;

    return response;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updatePlan(@Param('id') id: string, @Body() orderData: UpdateOrderStatusDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const order = await this.ordersService.updateStatus(parseInt(id), appId, orderData);
    return order;
  }
}
