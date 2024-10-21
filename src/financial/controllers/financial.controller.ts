import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FinancialService } from '../services/financial.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreateFinancialDto } from '../dtos/create-financial.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateFinancialDto } from '../dtos/update-financial.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { FinancialDto } from '../dtos/financial.dto';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('financial')
export class FinancialController {
  constructor(private financialService: FinancialService) {}

  @Serialize(FinancialDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() financialData: CreateFinancialDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.financialService.createFinancial(financialData, appId, user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.financialService.findAllByApplication(appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findFinancial(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.financialService.findOneByApplication(parseInt(id), appId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateFinancial(
    @Param('id') id: string,
    @Body() reminderData: UpdateFinancialDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    const financial = await this.financialService.update(parseInt(id), appId, reminderData);
    return financial;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeFinancial(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.financialService.remove(parseInt(id), appId);
  }
}
