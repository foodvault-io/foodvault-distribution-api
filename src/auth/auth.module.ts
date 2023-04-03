import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import {
  RefreshJwtStrategy,
  AccessJwtStrategy,
  LocalStrategy,
  GoogleStrategy,
  FacebookStrategy,
  LinkedInStrategy
} from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    PrismaModule
  ],
  providers: [
    AuthService,
    AccessJwtStrategy,
    RefreshJwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    FacebookStrategy,
    LinkedInStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
