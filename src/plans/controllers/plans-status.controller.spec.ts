import { Test, TestingModule } from '@nestjs/testing';
import { PlansStatusController } from './plans-status.controller';

describe('PlansStatusController', () => {
  let controller: PlansStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansStatusController],
    }).compile();

    controller = module.get<PlansStatusController>(PlansStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
