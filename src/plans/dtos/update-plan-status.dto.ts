import { IsEnum, IsOptional } from 'class-validator';
import { PlanStatus } from '../entities/plan.entity';

export class UpdatePlanStatusDto {
  @IsEnum(PlanStatus)
  @IsOptional()
  status: PlanStatus;
}
