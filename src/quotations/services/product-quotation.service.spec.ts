/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductQuotationService } from './product-quotation.service';

describe('ProductQuotationService', () => {
  let service: ProductQuotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductQuotationService],
    }).compile();

    service = module.get<ProductQuotationService>(ProductQuotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
