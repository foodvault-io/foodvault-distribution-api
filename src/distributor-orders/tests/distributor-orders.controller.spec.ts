import { Test, TestingModule } from '@nestjs/testing';
import { DistributorOrdersController } from '../distributor-orders.controller';
import { DistributorOrdersService } from '../distributor-orders.service';

describe('DistributorOrdersController', () => {
  let controller: DistributorOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistributorOrdersController],
      providers: [DistributorOrdersService],
    }).compile();

    controller = module.get<DistributorOrdersController>(DistributorOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
