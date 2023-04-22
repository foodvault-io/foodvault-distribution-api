import { 
  Controller,
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Logger, 
  UseGuards,
  HttpCode,
  HttpStatus, 
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ACGuard, UseRoles } from 'nest-access-control';
import { Public, GetCurrentUserId } from '../common/decorators';

@Controller({
  path: 'restaurants',
  version: '1',
})
export class RestaurantsController {
  log: Logger = new Logger('RestaurantsController');

  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant',
    action: 'create',
    possession: 'own',
  })
  async createRestaurant(
    @GetCurrentUserId() ownerId: string,
    @Body() createRestaurantDto: CreateRestaurantDto
  ) {
    this.log.debug('Restaurant created by: ' + ownerId);
    return await this.restaurantsService.createRestaurant(ownerId, createRestaurantDto);
  }

  @Get()
  @Public()
  async findAll() {
    this.log.debug('All Restaurants');
    return await this.restaurantsService.findAll();
  }

  @Get(':id')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant',
    action: 'read',
    possession: 'any',
  })
  async findOneByRestaurantId(@Param('id') restaurantId: string) {
    this.log.debug('Restaurant by id: ' + restaurantId);
    return await this.restaurantsService.findOneByRestaurantId(restaurantId);
  }

  @Get('/own/:id')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant',
    action: 'read',
    possession: 'own',
  })
  async findOneByRestaurantIdOwner(@Param('id') restaurantId: string) {
    this.log.debug('Owner Looked up Restaurant: ' + restaurantId);
    return await this.restaurantsService.findOneByRestaurantId(restaurantId);
  }

  @Get('/owner/many')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant',
    action: 'read',
    possession: 'own',
  })
  async findManyByOwnerId(
    @GetCurrentUserId() ownerId: string,
  ) {
    this.log.debug('Restaurants by owner id: ' + ownerId);
    return await this.restaurantsService.findManyByOwnerId(ownerId);
  }

  @Patch(':id')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant',
    action: 'update',
    possession: 'own',
  })
  async update(@Param('id') restaurantId: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    this.log.debug('Restaurant Updated: ' + restaurantId)
    return await this.restaurantsService.updateRestaurant(restaurantId, updateRestaurantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'restaurant',
    action: 'delete',
    possession: 'own',
  })
  async remove(@Param('id') restaurantId: string) {
    this.log.debug('Restaurant Deleted: ' + restaurantId)
    return await this.restaurantsService.removeRestaurant(restaurantId);
  }
}
