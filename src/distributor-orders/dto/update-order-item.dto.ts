import { PartialType } from '@nestjs/swagger';
import { CreateFoodOrderItemDto } from './create-order-item.dto';

export class UpdateOrderItemDto extends PartialType(CreateFoodOrderItemDto) { }
