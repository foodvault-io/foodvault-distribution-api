import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from '../restaurants.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateRestaurantDto, UpdateRestaurantDto } from '../dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantsService, PrismaService, ConfigService],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.cleanDb();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRestaurant()', () => {
    // arange
    const createRestaurantDto: CreateRestaurantDto = {
      status: 'ACTIVE',
      name: 'Test Restaurant',
      phone: '787-123-3445',
      description: 'Test Restaurant Description',
      website: null,
      image: null,
    };

    it('should create a restaurant and return it', async () => {
      // act
      const restaurant = await service.createRestaurant('1', createRestaurantDto);

      // assert
      expect(restaurant.status).toEqual(createRestaurantDto.status);
      expect(restaurant.name).toEqual(createRestaurantDto.name);
      expect(restaurant.phone).toEqual(createRestaurantDto.phone);
      expect(restaurant.description).toEqual(createRestaurantDto.description);
      expect(restaurant.website).toEqual(null);
      expect(restaurant.image).toEqual(null);
    });

    it('should throw an error if restaurant already exists', async () => {
      // assert
      await service.createRestaurant('1', createRestaurantDto);

      await expect(service.createRestaurant('1', createRestaurantDto)).rejects.toThrowError(
        new BadRequestException('Restaurant already exists')
      );
    })
  });

  describe('findAll()', () => {
    it('should return an array of restaurants', async () => {
      // arrange
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      const createRestaurantDto2: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 2',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      const createRestaurantDto3: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 3',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      // act
      const restaurants = await service.findAll();

      // assert
      expect(restaurants).toBeDefined();
      expect(restaurants.length).toEqual(0);

      await service.createRestaurant('1', createRestaurantDto);
      await service.createRestaurant('2', createRestaurantDto2);
      await service.createRestaurant('3', createRestaurantDto3);

      const restaurants2 = await service.findAll();

      expect(restaurants2).toBeDefined();
      expect(restaurants2.length).toEqual(3);
    });
  });

  describe('findOneByRestaurantId()', () => {
    it('should return a restaurant by id', async () => {
      // arrange
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      const restaurant = await service.createRestaurant('1', createRestaurantDto);

      // act
      const restaurant2 = await service.findOneByRestaurantId(restaurant.id);

      // assert
      expect(restaurant2).toBeDefined();
      expect(restaurant2.id).toEqual(restaurant.id);
      expect(restaurant2.name).toEqual(restaurant.name);
      expect(restaurant2.phone).toEqual(restaurant.phone);
      expect(restaurant2.description).toEqual(restaurant.description);
      expect(restaurant2.website).toEqual(restaurant.website);
      expect(restaurant2.image).toEqual(restaurant.image);
    });

    it('should throw an error if restaurant does not exist', async () => {
      // assert
      await expect(service.findOneByRestaurantId('1')).rejects.toThrowError(
        new BadRequestException('Restaurant not Found')
      );
    });
  });

  describe('findManyByOwnerId()', () => {
    it('should return an array of restaurants by owner id', async () => {
      // arrange
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      const createRestaurantDto2: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 2',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      const createRestaurantDto3: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 3',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      // assert
      await service.createRestaurant('1', createRestaurantDto);
      await service.createRestaurant('1', createRestaurantDto2);
      await service.createRestaurant('2', createRestaurantDto3);

      const restaurants2 = await service.findManyByOwnerId('1');

      expect(restaurants2).toBeDefined();
      expect(restaurants2.length).toEqual(2);

      const restaurants3 = await service.findManyByOwnerId('2');

      expect(restaurants3).toBeDefined();
      expect(restaurants3.length).toEqual(1);
    });

    it('should throw an error if Restaurant does not exist', async () => {
      // assert
      await expect(service.findManyByOwnerId('1')).rejects.toThrowError(
        new BadRequestException('Restaurant not Found')
      );
    });
  });

  describe('updateRestaurant()', () => {
    it('should update a restaurant and return it', async () => {
      // arrange
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      const restaurant = await service.createRestaurant('1', createRestaurantDto);

      const updateRestaurantDto: UpdateRestaurantDto = {
        name: 'Test Restaurant Updated',
        description: 'Test Restaurant Description Updated',
      };

      // act
      const restaurant2 = await service.updateRestaurant(restaurant.id, updateRestaurantDto);

      // assert
      expect(restaurant2).toBeDefined();
      expect(restaurant2.id).toEqual(restaurant.id);
      expect(restaurant2.name).toEqual(updateRestaurantDto.name);
      expect(restaurant2.phone).toEqual(createRestaurantDto.phone);
      expect(restaurant2.description).toEqual(updateRestaurantDto.description);
      expect(restaurant2.website).toEqual(null);
      expect(restaurant2.image).toEqual(null);
    });

    it('should throw an error if restaurant does not exist', async () => {
      // assert
      await expect(service.updateRestaurant('1', {})).rejects.toThrowError(
        new BadRequestException('Restaurant not Found')
      );
    });
  });

  describe('removeRestaurant()', () => {
    it('should delete a restaurant and return 204 status', async () => {
      // arrange
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant',
        phone: '787-123-3445',
        description: 'Test Restaurant Description',
        website: null,
        image: null,
      };

      const restaurant = await service.createRestaurant('1', createRestaurantDto);

      // act
      const restaurant2 = await service.removeRestaurant(restaurant.id);

      // assert
      expect(restaurant2).toEqual({
        status: 204,
        message: 'Deleted Restaurant Successfully',
      });
    });

    it('should throw an error if restaurant does not exist', async () => {
      // assert
      await expect(service.removeRestaurant('1')).rejects.toThrowError(
        new BadRequestException('Restaurant not Found')
      );
    });
  });
});
