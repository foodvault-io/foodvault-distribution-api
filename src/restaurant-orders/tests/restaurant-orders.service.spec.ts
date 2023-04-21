import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantOrdersService } from '../restaurant-orders.service';

describe('RestaurantOrdersService', () => {
  let service: RestaurantOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantOrdersService],
    }).compile();

    service = module.get<RestaurantOrdersService>(RestaurantOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
