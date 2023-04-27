import { Module } from '@nestjs/common';
import { DistributorOrdersService } from './distributor-orders.service';
import { DistributorOrdersController } from './distributor-orders.controller';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';

@Module({
  imports: [RestaurantsModule],
  controllers: [DistributorOrdersController],
  providers: [DistributorOrdersService],
})
export class DistributorOrdersModule {}
