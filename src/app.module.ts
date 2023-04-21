import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AccessControlModule } from 'nest-access-control';
import { RBAC_POLICY } from './auth/rbca.policy';
import { RestaurantOrdersModule } from './restaurant-orders/restaurant-orders.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccessControlModule.forRoles(RBAC_POLICY),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    RestaurantOrdersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
