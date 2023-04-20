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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
