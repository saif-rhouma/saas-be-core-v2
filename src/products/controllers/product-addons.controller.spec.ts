import { Test, TestingModule } from '@nestjs/testing';
import { ProductAddonsController } from './product-addons.controller';

describe('ProductAddonsController', () => {
  let controller: ProductAddonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAddonsController],
    }).compile();

    controller = module.get<ProductAddonsController>(ProductAddonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
