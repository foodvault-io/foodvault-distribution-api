import { Injectable, INestApplication, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                },
            },
        })
    }

    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }

    cleanDb() {
        return this.$transaction([
            this.user.deleteMany(),
            this.account.deleteMany(),
            this.restaurantDetails.deleteMany(),
            this.restaurantOrder.deleteMany(),
            this.orderItem.deleteMany(),
            this.product.deleteMany(),
            this.foodOrder.deleteMany(),
            this.foodOrderItem.deleteMany(),
            this.distributor.deleteMany(),
            this.media.deleteMany(),
            this.restaurantAddress.deleteMany(),
            this.distributorAddress.deleteMany(),
        ])
    }
}
