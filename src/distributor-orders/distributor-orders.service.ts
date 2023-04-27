import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistributorOrderDto, CreateFoodOrderItemDto, UpdateDistributorOrderDto, UpdateOrderItemDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';


@Injectable()
export class DistributorOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly restaurantService: RestaurantsService,
  ){}

  async createDistributorOrder(
    distributorOrderDto: CreateDistributorOrderDto,
  ) {
    try {
      const order = await this.prisma.foodOrder.create({
        data: {
          orderName: distributorOrderDto.orderName,
          dateOfOrder: distributorOrderDto.dateOfOrder ? distributorOrderDto.dateOfOrder : null,
          orderDescription: distributorOrderDto.orderDescription ? distributorOrderDto.orderDescription : null,
          distributor: distributorOrderDto.distributor,
          distributorId: distributorOrderDto.distributorId ? distributorOrderDto.distributorId : null,
          restaurantId: distributorOrderDto.restaurantId,
        }
      });

      return {
        distributorOrderId: order.id,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Distributor Order already exists');
      }
      throw error;
    }
  }

  async createDistributorOrderItem(
    orderId: string,
    orderItemDto: CreateFoodOrderItemDto,
  ) {
    try {
      const orderItem = await this.prisma.foodOrderItem.create({
        data: {
          productName: orderItemDto.productName,
          productId: orderItemDto.productId ? orderItemDto.productId : null,
          description: orderItemDto.description ? orderItemDto.description : null,
          quantity: orderItemDto.quantity,
          price: orderItemDto.price,
          foodOrderId: orderId,
        }
      });

      const updatedOrder = await this.prisma.foodOrder.update({
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
    } catch (error) {
      if(error.code === 'P2002') {
        throw new NotFoundException('Order already exists');
      }
      throw error;
    }
  }

  async findDistributorOrders() {
    const orders = await this.prisma.foodOrder.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          }
        },
        distributorInfo: true,
      }
    });

    if (orders.length === 0) {
      return {
        message: 'No orders found',
      }
    }

    return orders;
  }

  async findMyDistributorOrders(restaurantId: string) {
    const myOrders = await this.prisma.foodOrder.findMany({
      where: {
        restaurantId: restaurantId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        distributorInfo: true,
      }
    });

    if (myOrders.length === 0) {
      return {
        message: 'No orders found for restaurant: ' + restaurantId,
      }
    }

    return myOrders;
  }

  async findOneByOwner(orderId: string) {
    const order = await this.prisma.foodOrder.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          }
        },
        distributorInfo: true,
      }
    });

    if (!order) {
      return new NotFoundException('Order not found');
    }

    return order; 
  }

  async updateDistributorOrder(orderId: string, updateDistributorOrderDto: UpdateDistributorOrderDto) {
    const order = await this.prisma.foodOrder.findUnique({
      where: {
        id: orderId,
      }
    })

    if (!order) {
      return new NotFoundException('Order not found');
    }
    
    try {
      const updatedOrder = await this.prisma.foodOrder.update({
        where: {
          id: orderId,
        },
        data: {
          orderName: updateDistributorOrderDto.orderName ? updateDistributorOrderDto.orderName : order.orderName,
          dateOfOrder: updateDistributorOrderDto.dateOfOrder ? updateDistributorOrderDto.dateOfOrder : order.dateOfOrder,
          orderDescription: updateDistributorOrderDto.orderDescription ? updateDistributorOrderDto.orderDescription : order.orderDescription,
          distributor: updateDistributorOrderDto.distributor ? updateDistributorOrderDto.distributor : order.distributor,
          distributorId: updateDistributorOrderDto.distributorId ? updateDistributorOrderDto.distributorId : order.distributorId,
        }
      });

      return updatedOrder;
    } catch (error) {
      throw new BadRequestException('Error updating order');
    }
  }

  async updateDistributorOrderItem(orderItemId: string, updateFoodItemDto: UpdateOrderItemDto) {
    try {
      const orderItem = await this.prisma.foodOrderItem.findUnique({
        where: {
          id: orderItemId,
        }
      });

      if (!orderItem) {
        return new NotFoundException('Order Item not found');
      }

      const updatedOrderItem = await this.prisma.foodOrderItem.update({
        where: {
          id: orderItemId,
        },
        data: {
          productName: updateFoodItemDto.productName ? updateFoodItemDto.productName : orderItem.productName,
          productId: updateFoodItemDto.productId ? updateFoodItemDto.productId : orderItem.productId,
          description: updateFoodItemDto.description ? updateFoodItemDto.description : orderItem.description,
          quantity: updateFoodItemDto.quantity ? updateFoodItemDto.quantity : orderItem.quantity,
          price: updateFoodItemDto.price ? updateFoodItemDto.price : orderItem.price,
        }
      });

      return updatedOrderItem;
    } catch (error) {
      throw new BadRequestException('Error updating order item');
    }
  }
  

  async removeDistributorOrder(orderId: string) {
    try {
      const order = await this.prisma.foodOrder.findUnique({
        where: {
          id: orderId,
        }
      });

      if (!order) {
        return new NotFoundException('Order not found');
      }

      await this.prisma.foodOrder.delete({
        where: {
          id: orderId,
        }
      })

      return {
        status: 204,
        message: 'Deleted Past Distributor Order Successfully',
      }
    } catch (error) {
      throw error;
    }
  }

  async removeDistributorOrderItem(orderItemId: string) {
    try {
      const orderItem = await this.prisma.foodOrderItem.findUnique({
        where: {
          id: orderItemId,
        }
      });

      if (!orderItem) {
        return new NotFoundException('Order Item not found');
      }

      await this.prisma.foodOrderItem.delete({
        where: {
          id: orderItemId,
        }
      });

      return {
        status: 204,
        message: 'Deleted Order Item Successfully',
      }
    } catch (error) {
      throw error;
    }
  }
}
