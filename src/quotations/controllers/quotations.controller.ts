/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import getApplicationId from 'src/common/helpers/application-id.func';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { User } from 'src/users/entities/user.entity';
import { CreateQuotationDto } from '../dtos/create-quotation.dto';
import { QuotationDto } from '../dtos/quotation.dto';
import { UpdateQuotationDto } from '../dtos/update-quotation.dto';
import { QuotationsService } from '../services/quotations.service';

@Controller('quotations')
export class QuotationsController {
  constructor(private quotationsService: QuotationsService) {}

  @Serialize(QuotationDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createQuotation(@Body() quotationData: CreateQuotationDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.quotationsService.createQuotation(quotationData, user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/approve/order/')
  async approveConfirm(@Body() payload: any, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const quotation = await this.quotationsService.approveAndCreateOrder(payload.quotationId, user.id, appId);
    return quotation;
  }

  @Serialize(QuotationDto)
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.quotationsService.findAllByApplication(appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  findQuotation(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.quotationsService.findOneByApplication(id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/edit/:id')
  async updateQuotation(
    @Param('id') id: string,
    @Body() quotationData: UpdateQuotationDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    return this.quotationsService.updateQuotation(id, appId, quotationData);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() quotationData: UpdateQuotationDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    return this.quotationsService.update(id, appId, quotationData);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeQuotation(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.quotationsService.remove(id, appId);
  }
}
