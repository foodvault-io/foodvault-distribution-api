import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards } from '@nestjs/common';
import { RestaurantOrdersService } from './restaurant-orders.service';
import { 
  CreateRestaurantOrderDto,
  UpdateRestaurantOrderDto,
  CreateOrderItemDto,
} from './dto';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller({
  path: 'restaurant-orders',
  version: '1',
})
export class RestaurantOrdersController {
  log: Logger = new Logger('RestaurantOrdersController');

  constructor(private readonly restaurantOrdersService: RestaurantOrdersService) {}

  @Post()
  async createOrder(
    @Body() createRestaurantOrderDto: CreateRestaurantOrderDto,
  ) {
    this.log.debug('Restaurant Order created for restaurant: ' + createRestaurantOrderDto.restaurantId)

    return await this.restaurantOrdersService.createOrder(
      createRestaurantOrderDto,
    );
  }

  @Post(':orderId/order-items')
  async createOrderItem(
    @Param('orderId') orderId: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    this.log.debug('Order Item created for order: ' + orderId)
    return await this.restaurantOrdersService.createOrderItem(
      orderId,
      createOrderItemDto,
    );
  }

  @Get()
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant-orders',
    action: 'read',
    possession: 'any',
  })
  async findRestaurantOrders() {
    this.log.debug('Restaurant Orders found')
    return await this.restaurantOrdersService.findRestaurantOrders();
  }

  @Get('/restaurant/:restaurantId')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant-orders',
    action: 'read',
    possession: 'own',
  })
  async findMyRestaurantOrders(
    @Param('restaurantId') restaurantId: string,
  ) {
    this.log.debug('Restaurant Orders found for restaurant: ' + restaurantId)
    return await this.restaurantOrdersService.findMyRestaurantOrders(restaurantId)
  }

  @Get(':id')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant-orders',
    action: 'read',
    possession: 'own',
  })
  async findOneByOwner(@Param('id') orderId: string) {
    this.log.debug('Restaurant Order found: ' + orderId)
    return this.restaurantOrdersService.findOneByOwner(orderId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantOrderDto: UpdateRestaurantOrderDto) {
    return this.restaurantOrdersService.update(+id, updateRestaurantOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantOrdersService.remove(+id);
  }
}
