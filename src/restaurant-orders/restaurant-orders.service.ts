import { Injectable } from '@nestjs/common';
import { 
  CreateOrderItemDto,
  CreateProductDto,
  CreateRestaurantOrderDto, 
  UpdateRestaurantOrderDto 
} from './dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly restaurantService: RestaurantsService,
  ) {}

  async createOrder(
    restaurantOrderDto: CreateRestaurantOrderDto,
  ) {
    const order = await this.prisma.restaurantOrder.create({
      data: {
        restaurantId: restaurantOrderDto.restaurantId,
      }
    });

    return {
      orderId: order.id,
    };
  }

  async createOrderItem(
    orderId: string,
    orderItemDto: CreateOrderItemDto,
  ) {
    const orderItem = await this.prisma.orderItem.create({
      data: {
        quantity: orderItemDto.quantity,
        productId: orderItemDto.productId,
        orderPlacedId: orderId
      }
    });

    const updatedOrder = await this.prisma.restaurantOrder.update({
      where: {
        id: orderId,
      },
      data: {
        orderItems: {
          connect: {
            id: orderItem.id,
          }
        }
      }
    });

    return {
      orderId: updatedOrder.id,
      orderItemId: orderItem.id,
    }
  }

  findAll() {
    return `This action returns all restaurantOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurantOrder`;
  }

  update(id: number, updateRestaurantOrderDto: UpdateRestaurantOrderDto) {
    return `This action updates a #${id} restaurantOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantOrder`;
  }
}
