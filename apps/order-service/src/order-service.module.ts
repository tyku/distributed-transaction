import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { OrderServiceController } from './order-service.controller';
import { OrderService } from './order-service.service';
import { OrderEntity } from './entities/order.entity';
import { KAFKA_CONFIG_CLIENT_SERVICE_TOKEN } from './constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONFIG_CLIENT_SERVICE_TOKEN,
        useFactory: (configService: ConfigService) =>
          configService.get<object>('kafka'),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrderServiceController],
  providers: [OrderService],
})
export class OrderServiceModule {}
