import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantOrderDto } from './create-order.dto';

export class UpdateRestaurantOrderDto extends PartialType(CreateRestaurantOrderDto) {}
