import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from '../restaurants.controller';
import { RestaurantsService } from '../restaurants.service';
import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ACGuard, AccessControlModule, RolesBuilder } from 'nest-access-control';
import { PrismaService } from '../../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RBAC_POLICY } from '../../auth/rbca.policy';
import { CreateRestaurantDto, UpdateRestaurantDto } from '../dto';
import { RoleEnum } from '@prisma/client';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;
  let prisma: PrismaService;
  let testRestaurant: any;
  let reflector: Reflector;
  let acGuard: ACGuard;
  let roleBuilder: RolesBuilder;
  let guard: ACGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        RestaurantsService,
        PrismaService,
        AuthService,
        ConfigService,
        Reflector,
        ACGuard,
        {
          provide: RolesBuilder,
          useValue: new RolesBuilder(),
        }
      ],
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
        AccessControlModule.forRoles(RBAC_POLICY)
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
    prisma = module.get<PrismaService>(PrismaService);
    reflector = module.get<Reflector>(Reflector);
    acGuard = module.get<ACGuard>(ACGuard);
    roleBuilder = module.get<RolesBuilder>(RolesBuilder);

    guard = new ACGuard(reflector, roleBuilder);
  });

  afterEach(async () => {
    await prisma.cleanDb();
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('creaeRestaurant', () => {
    it('should create a restaurant', async () => {
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 2',
        phone: '787-745-8394',
        description: 'Test Restaurant Description',
        website: 'https://test-restaurant.com',
        image: null,
      };

      const restaurant = await controller.createRestaurant('1', createRestaurantDto);

      expect(restaurant).toEqual({
        ...createRestaurantDto,
        ownerId: '1',
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findAll()', () => {
    it('should return an array of restaurants', async () => {
      const result = await controller.findAll();

      expect(result).toBeDefined();
    });
  });

  describe('findOneByRestaurantId()', () => {
    const restaurantUser = {
      id: 'restaurant-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'restaurant@email.com',
      firstName: 'Restaurant',
      lastName: 'User',
      hashedPassword: undefined,
      image: null,
      role: RoleEnum.RESTAURANT,
    };

    const adminUser = {
      id: 'admin-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'admin@email.com',
      firstName: 'Admin',
      lastName: 'User',
      hashedPassword: undefined,
      image: null,
      role: RoleEnum.ADMIN,
    };
    it('should return restuarant by id', async () => {
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 2',
        phone: '787-745-8394',
        description: 'Test Restaurant Description',
        website: 'https://test-restaurant.com',
        image: null,
      };

      const restaurant = await controller.createRestaurant(restaurantUser.id, createRestaurantDto);

      const result = await controller.findOneByRestaurantId(restaurant.id);

      expect(result).toEqual(restaurant);
    });
  });

  describe('findOneByRestaurantIdOwner()', () => {
    const restaurantUser = {
      id: 'restaurant-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'restaurant@email.com',
      firstName: 'Restaurant',
      lastName: 'User',
      hashedPassword: undefined,
      image: null,
      role: RoleEnum.RESTAURANT,
    };

    it('should return owners restaurant by ID', async () => {
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 2',
        phone: '787-745-8394',
        description: 'Test Restaurant Description',
        website: 'https://test-restaurant.com',
        image: null,
      };

      const restaurant = await controller.createRestaurant(restaurantUser.id, createRestaurantDto);

      const result = await controller.findOneByRestaurantIdOwner(restaurant.id);

      expect(result).toEqual(restaurant);
    });
  });

  describe('findManyByOwnerId', () => {
    const restaurantUser = {
      id: 'restaurant-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'restaurant@email.com',
      firstName: 'Restaurant',
      lastName: 'User',
      hashedPassword: undefined,
      image: null,
      role: RoleEnum.RESTAURANT,
    };

    it('should return array of restaurants by owner ID', async () => {
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 2',
        phone: '787-745-8394',
        description: 'Test Restaurant Description',
        website: 'https://test-restaurant.com',
        image: null,
      };

      const createRestaurantDto2: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 3',
        phone: '787-745-8394',
        description: 'Test Restaurant Description',
        website: 'https://test-restaurant.com',
        image: null,
      };

      const restaurant =await controller.createRestaurant(restaurantUser.id, createRestaurantDto);
      const restaurant2 =await controller.createRestaurant(restaurantUser.id, createRestaurantDto2);

      const result = await controller.findManyByOwnerId(restaurantUser.id);

      expect(result.length).toEqual(2);
    });
  });

  describe('update()', () => {
    const restaurantUser = {
      id: 'restaurant-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'restaurant@email.com',
      firstName: 'Restaurant',
      lastName: 'User',
      hashedPassword: undefined,
      image: null,
      role: RoleEnum.RESTAURANT,
    };

    it('should update the restaurant selected', async () => {
      const createRestaurantDto: CreateRestaurantDto = {
        status: 'ACTIVE',
        name: 'Test Restaurant 2',
        phone: '787-745-8394',
        description: 'Test Restaurant Description',
        website: 'https://test-restaurant.com',
        image: null,
      };

      const restaurant = await controller.createRestaurant(restaurantUser.id, createRestaurantDto);

      const updateRestaurantDto: UpdateRestaurantDto = {
        name: 'Test Restaurant New',
        description: 'Test Restaurant Description Updated',
      };

      const result = await controller.update(restaurant.id, updateRestaurantDto);

      expect(result).toEqual({
        name: 'Test Restaurant New',
        description: 'Test Restaurant Description Updated',
        status: 'ACTIVE',
        phone: '787-745-8394',
        website: 'https://test-restaurant.com',
        image: null,
        id: restaurant.id,
        ownerId: restaurant.ownerId,
        createdAt: restaurant.createdAt,
        updatedAt: expect.any(Date),
      });
    });

    describe('remove()', () => {
      const restaurantUser = {
        id: 'restaurant-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'restaurant@email.com',
        firstName: 'Restaurant',
        lastName: 'User',
        hashedPassword: undefined,
        image: null,
        role: RoleEnum.RESTAURANT,
      };

      it('should delete a restaurant', async () => {
        const createRestaurantDto: CreateRestaurantDto = {
          status: 'ACTIVE',
          name: 'Test Restaurant 2',
          phone: '787-745-8394',
          description: 'Test Restaurant Description',
          website: 'https://test-restaurant.com',
          image: null,
        };

        const restaurant = await controller.createRestaurant(restaurantUser.id, createRestaurantDto);

        const result = await controller.remove(restaurant.id);

        expect(result).toEqual({
          status: 204,
          message: 'Deleted Restaurant Successfully',
        });
      });
    });
  });
});
