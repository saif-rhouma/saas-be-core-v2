import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsGroupService } from './permissions-group.service';

describe('PermissionsGroupService', () => {
  let service: PermissionsGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsGroupService],
    }).compile();

    service = module.get<PermissionsGroupService>(PermissionsGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
