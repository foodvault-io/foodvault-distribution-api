import { Test, TestingModule } from '@nestjs/testing';
import { DistributorOrdersService } from '../distributor-orders.service';

describe('DistributorOrdersService', () => {
  let service: DistributorOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistributorOrdersService],
    }).compile();

    service = module.get<DistributorOrdersService>(DistributorOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
