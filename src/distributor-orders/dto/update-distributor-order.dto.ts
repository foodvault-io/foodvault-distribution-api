import { PartialType } from '@nestjs/swagger';
import { CreateDistributorOrderDto } from './create-distributor-order.dto';

export class UpdateDistributorOrderDto extends PartialType(CreateDistributorOrderDto) {}
