import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { PlansService } from '../services/plans.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import getApplicationId from 'src/common/helpers/application-id.func';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { COLUMNS_PLANS_STATUS } from 'src/common/constants/kanban-configs';
import { PlanStatus } from '../entities/plan.entity';
import { UpdatePlanStatusDto } from '../dtos/update-plan-status.dto';

@Controller('plans-status')
export class PlansStatusController {
  constructor(private plansService: PlansService) {}

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const plans = await this.plansService.findAllByApplication(appId);
    if (!plans) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    const response = { board: { columns: COLUMNS_PLANS_STATUS, tasks: {} } };
    const tasks = {};
    COLUMNS_PLANS_STATUS.forEach((col) => {
      tasks[col.id] = [];
    });
    plans.forEach((plan) => {
      if (plan.status === PlanStatus.Pending) {
        tasks[COLUMNS_PLANS_STATUS[0].id].push(plan);
      }
      if (plan.status === PlanStatus.ProcessingA) {
        tasks[COLUMNS_PLANS_STATUS[1].id].push(plan);
      }
      if (plan.status === PlanStatus.ProcessingB) {
        tasks[COLUMNS_PLANS_STATUS[2].id].push(plan);
      }
      if (plan.status === PlanStatus.Ready) {
        tasks[COLUMNS_PLANS_STATUS[3].id].push(plan);
      }
    });
    response.board.tasks = tasks;
    return response;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updatePlan(@Param('id') id: string, @Body() planData: UpdatePlanStatusDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const order = await this.plansService.update(parseInt(id), appId, planData, undefined);
    return order;
  }
}
