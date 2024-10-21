import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsGroupController } from './permissions-group.controller';

describe('PermissionsGroupController', () => {
  let controller: PermissionsGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsGroupController],
    }).compile();

    controller = module.get<PermissionsGroupController>(PermissionsGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
