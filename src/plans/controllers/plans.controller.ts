/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PlansService } from '../services/plans.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreatePlanDto } from '../dtos/create-plan.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdatePlanDto } from '../dtos/update-plan.dto';
import { PlanDto } from '../dtos/plan.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Serialize(PlanDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() planData: CreatePlanDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.plansService.createPlan(planData, user.id, planData.productId, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/stock/:id')
  async transferToStock(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const plan = await this.plansService.transferToStock(parseInt(id), appId);
    return plan;
  }

  @Serialize(PlanDto)
  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const plans = await this.plansService.findAllByApplication(appId);
    if (!plans) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return plans;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findPlan(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const plan = await this.plansService.findOneByApplication(parseInt(id), appId);
    return plan;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updatePlan(@Param('id') id: string, @Body() planData: UpdatePlanDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const plan = await this.plansService.update(parseInt(id), appId, planData, planData.productId);
    return plan;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removePlan(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.plansService.remove(parseInt(id), appId);
  }
}
