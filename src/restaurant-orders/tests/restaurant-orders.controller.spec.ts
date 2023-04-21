import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantOrdersController } from '../restaurant-orders.controller';
import { RestaurantOrdersService } from '../restaurant-orders.service';

describe('RestaurantOrdersController', () => {
  let controller: RestaurantOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantOrdersController],
      providers: [RestaurantOrdersService],
    }).compile();

    controller = module.get<RestaurantOrdersController>(RestaurantOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
