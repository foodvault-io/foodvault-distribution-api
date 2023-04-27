import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { DistributorOrdersService } from './distributor-orders.service';
import { 
  CreateDistributorOrderDto,
  UpdateDistributorOrderDto,
  CreateFoodOrderItemDto,
  UpdateOrderItemDto,
} from './dto';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller({
  path: 'distributor-orders',
  version: '1',
})
export class DistributorOrdersController {
  log: Logger = new Logger('DistributorOrdersController');

  constructor(private readonly distributorOrdersService: DistributorOrdersService) {}

  @Post()
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'create',
    possession: 'own',
  })
  async createDistributorOrder(
    @Body() createDistributorOrderDto: CreateDistributorOrderDto,
  ) {
    this.log.debug('Distributor Order created for restaurant: ' + createDistributorOrderDto.restaurantId)

    return await this.distributorOrdersService.createDistributorOrder(
      createDistributorOrderDto,
    );
  }

  @Post(':orderId/order-items')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'create',
    possession: 'own',
  })
  async createDistributorOrderItem(
    @Param('orderId') orderId: string,
    @Body() createOrderItemDto: CreateFoodOrderItemDto,
  ) {
    this.log.debug('Order Item created for order: ' + orderId)
    return await this.distributorOrdersService.createDistributorOrderItem(
      orderId,
      createOrderItemDto,
    )
  }

  @Get()
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'read',
    possession: 'any',
  })
  async findDistributorOrders() {
    this.log.debug('Distributor Orders found')
    return await this.distributorOrdersService.findDistributorOrders();
  }

  @Get('/restaurant/:restaurantId')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'read',
    possession: 'own',
  })
  async findMyDistributorOrders(
    @Param('restaurantId') restaurantId: string,
  ) {
    this.log.debug('Distributor Orders found for restaurant: ' + restaurantId)
    return await this.distributorOrdersService.findMyDistributorOrders(restaurantId);
  }

  @Get(':id')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'read',
    possession: 'own',
  })
  async findOneByOwner(
    @Param('id') orderId: string,
  ) {
    this.log.debug('Distributor Order found: ' + orderId)
    return await this.distributorOrdersService.findOneByOwner(orderId);
  }

  @Patch('restaurant/update/:orderId')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'update',
    possession: 'own',
  })
  async updateDistributorOrder(
    @Param('orderId') orderId: string, 
    @Body() updateDistributorOrderDto: UpdateDistributorOrderDto
  ) {
    this.log.debug('Distributor Order updated: ' + orderId)
    return await this.distributorOrdersService.updateDistributorOrder(
      orderId,
      updateDistributorOrderDto,
    )
  }

  @Patch('restaurant/update/order-items/:orderItemId')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'update',
    possession: 'own',
  })
  async updateDistributorOrderItem(
    @Param('orderItemId') orderItemId: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    this.log.debug('Order Item updated: ' + orderItemId)
    return await this.distributorOrdersService.updateDistributorOrderItem(
      orderItemId,
      updateOrderItemDto,
    )
  }

  @Delete('/restaurant/delete/:orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'delete',
    possession: 'own',
  })
  async removeDistributorOrder(@Param('orderId') orderId: string) {
    this.log.debug('Distributor Order deleted: ' + orderId)
    return await this.distributorOrdersService.removeDistributorOrder(orderId);
  }

  @Delete('/restaurant/delete/order-items/:orderItemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'distributor-orders',
    action: 'delete',
    possession: 'own',
  })
  async removeDistributorOrderItem(
    @Param('orderItemId') orderItemId: string,
  ) {
    this.log.debug('Order Item deleted: ' + orderItemId)
    return await this.distributorOrdersService.removeDistributorOrderItem(orderItemId);
  }
}
