import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { NotificationEntity } from '@app/notification-service/entities/notification.entity';

import { KAFKA_CONFIG_NOTIFICATION_SERVICE_TOKEN } from '../constants';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    ClientsModule.registerAsync([
      {
        name: KAFKA_CONFIG_NOTIFICATION_SERVICE_TOKEN,
        useFactory: (configService: ConfigService) =>
          configService.get<object>('kafka'),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
