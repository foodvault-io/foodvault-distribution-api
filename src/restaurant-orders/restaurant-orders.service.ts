import { Injectable, NotFoundException } from '@nestjs/common';
import { 
  CreateOrderItemDto,
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

  async findRestaurantOrders() {
    const orders = await this.prisma.restaurantOrder.findMany({
      include: {
        orderItems: true,
      }
    });

    if (orders.length === 0) {
      return {
        message: 'No orders found',
      }
    }
    
    return orders;
  }

  async findMyRestaurantOrders(restaurantId: string) {
    const myOrders = await this.prisma.restaurantOrder.findMany({
      where: {
        restaurantId: restaurantId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          }
        }
      }
    })

    if (myOrders.length === 0) {
      return {
        message: 'No orders found for restaurant: ' + restaurantId,
      }
    }

    return myOrders;
  }

  async findOneByOwner(orderId: string) {
    const order = await this.prisma.restaurantOrder.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          }
        }
      }
    });

    if (!order) {
      return new NotFoundException('Order not found');
    }

    return order;
  }

  update(id: number, updateRestaurantOrderDto: UpdateRestaurantOrderDto) {
    return `This action updates a #${id} restaurantOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantOrder`;
  }
}
