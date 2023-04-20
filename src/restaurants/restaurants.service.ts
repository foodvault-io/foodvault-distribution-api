import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RestaurantDetails, RestaurantStatus } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createRestaurant(ownerId: string, createRestaurantDto: CreateRestaurantDto) {
    try {
      const restaurant = await this.prisma.restaurantDetails.create({
        data: {
          status: createRestaurantDto.status? createRestaurantDto.status : RestaurantStatus.ACTIVE,
          name: createRestaurantDto.name,
          phone: createRestaurantDto.phone,
          description: createRestaurantDto.description? createRestaurantDto.description : null,
          website: createRestaurantDto.website? createRestaurantDto.website : null,
          image: createRestaurantDto.image? createRestaurantDto.image : null,
          ownerId: ownerId,
        }
      })

      return restaurant;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new BadRequestException('Restaurant already exists');
      }
      throw err;
    }
  }

  async findAll(): Promise<Partial<RestaurantDetails>[] | undefined> {
    return await this.prisma.restaurantDetails.findMany();
  }

  async findOneByRestaurantId(id: string): Promise<RestaurantDetails | undefined> {
    const restaurant = await this.prisma.restaurantDetails.findFirst({
      where: {
        id: id
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not Found');
    }

    return restaurant;
  }

  async findManyByOwnerId(id: string): Promise<RestaurantDetails[] | undefined> {
    const restaurant = await this.prisma.restaurantDetails.findMany({
      where: {
        ownerId: id
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not Found');
    }

    return restaurant;
  }


  async updateRestaurant(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<Partial<RestaurantDetails>> {
    const restaurant = await this.prisma.restaurantDetails.findUnique({
      where: {
        id: id
      }
    })

    if (!restaurant) {
      throw new NotFoundException('Restaurant not Found');
    }

    const updatedRestaurant = await this.prisma.restaurantDetails.update({
      where: {
        id: id
      },
      data: {
        status: updateRestaurantDto.status? updateRestaurantDto.status : restaurant.status,
        name: updateRestaurantDto.name? updateRestaurantDto.name : restaurant.name,
        phone: updateRestaurantDto.phone? updateRestaurantDto.phone : restaurant.phone,
        description: updateRestaurantDto.description? updateRestaurantDto.description : restaurant.description,
        website: updateRestaurantDto.website? updateRestaurantDto.website : restaurant.website,
        image: updateRestaurantDto.image? updateRestaurantDto.image : restaurant.image,
      }
    })

    return updatedRestaurant;
  }

  async removeRestaurant(id: string) {
    try {
      const restaurant = await this.prisma.restaurantDetails.findUnique({
        where: {
          id: id
        }
      })

      if (!restaurant) {
        throw new NotFoundException('Restaurant not Found');
      }

      await this.prisma.restaurantDetails.delete({
        where: {
          id: restaurant.id
        }
      })

      return {
        status: 204,
        message: 'Deleted Restaurant Successfully',
      }
    } catch (err) {
      throw err;
    }
  }
}
