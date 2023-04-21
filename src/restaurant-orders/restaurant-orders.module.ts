import { Module } from '@nestjs/common';
import { RestaurantOrdersService } from './restaurant-orders.service';
import { RestaurantOrdersController } from './restaurant-orders.controller';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';

@Module({
  imports: [RestaurantsModule],
  controllers: [RestaurantOrdersController],
  providers: [RestaurantOrdersService]
})
export class RestaurantOrdersModule {}
