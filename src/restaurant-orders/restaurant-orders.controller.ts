import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { RestaurantOrdersService } from './restaurant-orders.service';
import { 
  CreateRestaurantOrderDto,
  UpdateRestaurantOrderDto,
  CreateOrderItemDto,
  CreateProductDto 
} from './dto';

@Controller({
  path: 'restaurant-orders',
  version: '1',
})
export class RestaurantOrdersController {
  loggin: Logger = new Logger('RestaurantOrdersController');

  constructor(private readonly restaurantOrdersService: RestaurantOrdersService) {}

  @Post()
  async createOrder(
    @Body() createRestaurantOrderDto: CreateRestaurantOrderDto,
  ) {
    this.loggin.debug('Restaurant Order created for restaurant: ' + createRestaurantOrderDto.restaurantId)

    return await this.restaurantOrdersService.createOrder(
      createRestaurantOrderDto,
    );
  }

  @Post(':orderId/order-items')
  async createOrderItem(
    @Param('orderId') orderId: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    this.loggin.debug('Order Item created for order: ' + orderId)
    return await this.restaurantOrdersService.createOrderItem(
      orderId,
      createOrderItemDto,
    );
  }

  @Get()
  findAll() {
    return this.restaurantOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantOrdersService.findOne(+id);
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
