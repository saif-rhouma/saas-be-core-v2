import { Test, TestingModule } from '@nestjs/testing';
import { SupplyingService } from './supplying.service';

describe('SupplyingService', () => {
  let service: SupplyingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyingService],
    }).compile();

    service = module.get<SupplyingService>(SupplyingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
