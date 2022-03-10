import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@app/order-service/entities/order.entity';

import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_CONFIG_ORDER_SERVICE_TOKEN } from '../constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONFIG_ORDER_SERVICE_TOKEN,
        useFactory: (configService: ConfigService) =>
          configService.get<object>('kafka'),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrderServiceController],
  providers: [OrderServiceService],
})
export class OrderServiceModule {}
