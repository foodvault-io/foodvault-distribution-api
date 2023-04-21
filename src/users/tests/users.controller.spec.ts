import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { AuthService } from '../../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RoleEnum, User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACGuard, AccessControlModule, RolesBuilder } from 'nest-access-control';
import { RBAC_POLICY } from '../../auth/rbca.policy';


describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let prisma: PrismaService;
  let testUser: User;
  let reflector: Reflector;
  let acGuard: ACGuard;
  let roleBuilder: RolesBuilder;
  let guard: ACGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, 
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    reflector = module.get<Reflector>(Reflector);
    acGuard = module.get<ACGuard>(ACGuard);
    roleBuilder = module.get<RolesBuilder>(RolesBuilder);

    guard = new ACGuard(reflector, roleBuilder);

    const createTestUser: CreateUserDto = {
      email: 'thor@odinson.com',
      firstName: 'Thor',
      lastName: 'Odinson',
      password: 'password',
    };

    testUser = await service.createUser(createTestUser);
  });

  afterEach(async () => {
    await prisma.cleanDb(); // Clean up the database
    await prisma.$disconnect(); // Disconnect from the database
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findOneById()', () => {
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
    it('should return a user by id', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(adminUser)
      const result = await controller.findOneById(adminUser.id);
      expect(result.id).toEqual(adminUser.id);
      expect(result.createdAt).toEqual(adminUser.createdAt);
      expect(result.updatedAt).toEqual(adminUser.updatedAt);
      expect(result.email).toEqual(adminUser.email);
      expect(result.firstName).toEqual(adminUser.firstName);
      expect(result.lastName).toEqual(adminUser.lastName);
      expect(result.role).toEqual(adminUser.role);
      expect(result.hashedPassword).toBeUndefined();
      expect(result.image).toBeNull();
    });

    it('should throw an error if user is not found', async () => {
      const fakeAdminUser: User = {
        id: 'non-existent-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'admin@email.com',
        firstName: 'Admin',
        lastName: 'User',
        hashedPassword: 'hashed-password',
        image: null,
        role: RoleEnum.ADMIN,
      }

      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(fakeAdminUser);

      try {
        await controller.findOneById(fakeAdminUser.id);
      } catch (err) {
        expect(err.message).toEqual(new NotFoundException('User not found').message);
      }
    });
  });

  describe('getMyself()', () => {
    const createTestUser: CreateUserDto = {
      email: 'thor1234@odinson.com',
      firstName: 'Thor',
      lastName: 'Odinson',
      password: 'password',
    };

    it('should return the logged in user', async () => {
      const testUser = await service.createUser(createTestUser);

      const result = await controller.getMyself(testUser.id);
      expect(result.id).toEqual(testUser.id);
      expect(result.createdAt).toEqual(testUser.createdAt);
      expect(result.updatedAt).toEqual(testUser.updatedAt);
      expect(result.email).toEqual(testUser.email);
      expect(result.firstName).toEqual(testUser.firstName);
      expect(result.lastName).toEqual(testUser.lastName);
      expect(result.role).toEqual(testUser.role);
      expect(result.hashedPassword).toBeUndefined();
      expect(result.image).toBeNull();
    });
  })

  describe('findOneByEmail()', () => {
    const adminUser: User = {
      id: 'admin-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'admin@email.com',
      firstName: 'Admin',
      lastName: 'User',
      hashedPassword: undefined,
      image: null,
      role: RoleEnum.ADMIN,
    }
    it('should return a user by email', async () => {
      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(adminUser)
      const result = await controller.findOneByEmail(adminUser.email);
      expect(result.id).toEqual(adminUser.id);
      expect(result.createdAt).toEqual(adminUser.createdAt);
      expect(result.updatedAt).toEqual(adminUser.updatedAt);
      expect(result.email).toEqual(adminUser.email);
      expect(result.firstName).toEqual(adminUser.firstName);
      expect(result.lastName).toEqual(adminUser.lastName);
      expect(result.role).toEqual(adminUser.role);
      expect(result.hashedPassword).toBeUndefined();
      expect(result.image).toBeNull();
    });

    it('should throw an error if user is not found', async () => {
      const fakeAdminUser: User = {
        id: 'non-existent-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'admin@email.com',
        firstName: 'Admin',
        lastName: 'User',
        hashedPassword: 'hashed-password',
        image: null,
        role: RoleEnum.ADMIN,
      }

      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(fakeAdminUser);


      try {
        await controller.findOneByEmail('non-existent-email');
      } catch (err) {
        expect(err.message).toEqual(new NotFoundException('User not found').message);
      }
    });
  });

  describe('update()', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Foster',
      };
      const result = controller.update(testUser.id, updateUserDto)

      expect(result).toEqual(`This action updates a #${testUser.id} user`)
    });
  });

  describe('remove()', () => {
    it('should soft delete a user', async () => {
      const result = controller.remove(testUser.id);
      expect(result).toEqual(`This action removes a #${testUser.id} user`);
    });
  });
});
