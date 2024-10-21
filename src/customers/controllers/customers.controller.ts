/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CustomerDto } from '../dtos/customer.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Serialize(CustomerDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() customerData: CreateCustomerDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.customersService.createCustomer(customerData, user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const customers = await this.customersService.findAllByApplication(appId);
    if (!customers) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }
    return customers;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findCustomer(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const results = await this.customersService.findOneByApplication(parseInt(id), appId);
    return results;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerData: UpdateCustomerDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    const customer = await this.customersService.update(parseInt(id), appId, customerData);
    return customer;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeCustomer(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.customersService.remove(parseInt(id), appId);
  }
}
