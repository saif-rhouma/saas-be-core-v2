import { Test, TestingModule } from '@nestjs/testing';
import { ProductAddonsService } from './product-addons.service';

describe('ProductAddonsService', () => {
  let service: ProductAddonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductAddonsService],
    }).compile();

    service = module.get<ProductAddonsService>(ProductAddonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
